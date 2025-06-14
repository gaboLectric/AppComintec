import React, { useState } from 'react';
import axios from 'axios';
import '../css/styles.css';
import '../css/login.css';

const API_URL = 'http://localhost:8080/api/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        username,
        password
      });
      
      // If authentication is successful, redirect to main page
      window.location.href = 'http://localhost:8080/html/main.html';
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Error de autenticación');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No se pudo conectar al servidor. Por favor, inténtalo de nuevo.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="login-box">
          <div className="login-header">
            <div className="login-logo">
              <div className="navbar-logo-img"></div>
              <span>Comintec</span>
            </div>
            <h2>Iniciar Sesión</h2>
            <p className="typing-text">Bienvenido de nuevo. Por favor ingresa tus credenciales para acceder al sistema.</p>
          </div>
          <form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user" aria-hidden="true"></i>
                <span>Usuario</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ingresa tu nombre de usuario"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock" aria-hidden="true"></i>
                <span>Contraseña</span>
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'} aria-hidden="true"></i>
                </button>
              </div>
            </div>
            {error && (
              <div className="error-message" role="alert" aria-live="assertive" style={{ display: 'block' }}>{error}</div>
            )}
            <button type="submit" className="login-button" aria-label="Iniciar sesión">
              <span>Iniciar Sesión</span>
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
              <div className="login-button-ripple"></div>
            </button>
          </form>
          <div className="login-footer">
            <p>© 2025 Comintec. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
