import Notification from "./Notification"
import PropTypes from 'prop-types'
import './css/login.css'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
  message
}) => {
  return (
    <div>
      <h2>Login</h2>
      <Notification message={message}/>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username </label>
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">password </label>
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  message: PropTypes.object
}

export default LoginForm