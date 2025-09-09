const ContactList = ({ contactos, onEditar, onBorrar }) => (
  <ul>
    {contactos.map((c) => (
      <li key={c.id}>
        {c.name} - {c.number}
        <button onClick={() => onEditar(c)}>Editar</button>
        <button onClick={() => onBorrar(c.id)}>Borrar</button>
      </li>
    ))}
  </ul>
)

export default ContactList
