import Menu from "../components/Menu";
import { useState, useEffect } from "react"
import contactsService from "../services/contacts"
import ContactList from "../components/ContactList"
import ContactForm from "../components/ContactForm";


const Callme = () => {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState(""); // Ahora con "ñ"
  const [correo, setCorreo] = useState("");
  const [contactos, setContactos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [comentario, setComentario] = useState("");

  // Obtener contactos al cargar el componente
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactsService.getAll();
        setContactos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener contactos:", err);
        setContactos([]);
      }
    };
    
    fetchContacts();
  }, []);

  // Agregar un nuevo contacto
  const agregar = async (e) => {
    e.preventDefault();
    try {
      if (!nombre.trim() || !contraseña.trim() || !correo.trim() || !comentario.trim()) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      console.log('Intentando crear contacto...');
      const contactoData = { 
        name: nombre, 
        number: contraseña, 
        email: correo, 
        comments: comentario
      };

      if (editId) {
        const contactoActualizado = await contactsService.update(editId, contactoData);
        setContactos(contactos.map((c) => (c.id === editId ? contactoActualizado : c)));
        console.log('Contacto actualizado:', contactoActualizado);
      } else {
        const contactoAgregado = await contactsService.create(contactoData);
        setContactos([...contactos, contactoAgregado]);
        console.log('Contacto agregado:', contactoAgregado);
        
        // Limpiar formulario solo si se agregó correctamente
        setNombre("");
        setContraseña("");
        setCorreo("");
        setComentario("");
      }
      setEditId(null);
      
    } catch (error) {
      console.error('Error completo:', error);
      const mensajeError = error.response?.data?.error || error.message || "Error al procesar el contacto";
      alert(mensajeError);
    }
  };

  // Borrar un contacto
  const borrar = (id) => {
    if (window.confirm("¿Seguro que quieres borrar este contacto?")) {
      contactsService
        .remove(id)
        .then(() => setContactos(contactos.filter((c) => c.id !== id)))
        .catch((err) => alert("Error al borrar contacto"));
    }
  };

  // Editar un contacto
  const editar = (contacto) => {
    setNombre(contacto.name);
    setContraseña(contacto.number || "");
    setCorreo(contacto.email || "");
    setEditId(contacto.id);
  };

  // Cancelar edición
  const cancelar = () => {
    setNombre("");
    setContraseña("");
    setCorreo("");
    setEditId(null);
  };

  return (
    <div>
      <Menu />
      <h2  className = "title"style={{ textAlign: "center" }}>Enviar una consulta</h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <ContactForm
            nombre={nombre}
            contraseña={contraseña}
            correo={correo}
            editId={editId}
            setNombre={setNombre}
            setContraseña={setContraseña}
            setCorreo={setCorreo}
            onSubmit={agregar}
            onCancel={cancelar}
             comentario={comentario}
             setComentario={setComentario}
            contactos={contactos}

          />
        </div>
        {/* 
        <div style={{ width: "100%", maxWidth: "800px", marginTop: "2rem" }}>
          <h3 style={{ textAlign: "center" }}>Contactos</h3>
          <ContactList
            contactos={contactos}
            onEditar={editar}
            onBorrar={borrar}
          />
        </div>
        */}
      </div>
    </div>
  );
};

export default Callme;
