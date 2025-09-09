import { useState } from "react";

const ContactForm = ({
  nombre,
  contraseña,
  correo,
  editId,
  setNombre,
  setContraseña,
  setCorreo,
  onSubmit,
  onCancel,
  comentario,
  setComentario,
  contactos = []
}) => {
  const [correoError, setCorreoError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");

  // Validar contraseña segura
  const validarContrasena = (value) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(value);
  };

  const handleContrasenaChange = (e) => {
    const value = e.target.value;
    setContraseña(value);

    if (!validarContrasena(value)) {
      setContrasenaError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial."
      );
    } else {
      setContrasenaError("");
    }
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);

    // Validar si el correo ya existe (excepto si se está editando el mismo contacto)
    const correoExiste = contactos.some(
      (c) => c.email === value && c.id !== editId
    );
    if (correoExiste) {
      setCorreoError("Este correo electrónico ya está registrado.");
    } else {
      setCorreoError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar correo
    const correoExiste = contactos.some(
      (c) => c.email === correo && c.id !== editId
    );
    if (correoExiste) {
      setCorreoError("Este correo electrónico ya está registrado.");
      return;
    }
    // Validar contraseña
    if (!validarContrasena(contraseña)) {
      setContrasenaError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial."
      );
      return;
    }
    setCorreoError("");
    setContrasenaError("");
    // Llama al submit original (agrega o edita contacto)
    const contactoId = await onSubmit(e);
    onSubmit(e);

    // Si hay comentario y se creó/actualizó el contacto, lo agrega
  
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Contraseña:
        <input
          type="password"
          value={contraseña}
          onChange={handleContrasenaChange}
          required
        />
      </label>
      {contrasenaError && (
        <div style={{ color: "red", marginTop: "4px" }}>{contrasenaError}</div>
      )}
      <br />
      <label>
        Correo electrónico:
        <input
          type="email"
          value={correo}
          onChange={handleCorreoChange}
          required
        />
      </label>
      {correoError && (
        <div style={{ color: "red", marginTop: "4px" }}>{correoError}</div>
      )}
      <br />
      <label>
        Comentario:
        <input
          type="text"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Agrega un comentario"
        />
      </label>
      <br />
      <button type="submit" disabled={!!correoError || !!contrasenaError}>
        {editId ? "Actualizar" : "Agregar"}
      </button>
      {editId && (
        <button type="button" onClick={onCancel}>Cancelar</button>
      )}
    </form>
  );
};

export default ContactForm;