const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const className = `message${message.type ? 'success' : 'error'}`
  
  return (
    <div className={className}>
      {message.message}
    </div>
  )
}

export default Notification
