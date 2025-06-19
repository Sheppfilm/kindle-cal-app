
import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (username: string, password: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded credentials for now
    if (username === 'admin' && password === 'calendar2024') {
      onAuth(username, password);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '400px', 
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{ 
        border: '4px solid black', 
        padding: '30px', 
        backgroundColor: 'white'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          textAlign: 'center',
          letterSpacing: '2px',
          fontFamily: 'monospace'
        }}>
          CALENDAR ACCESS
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              letterSpacing: '1px',
              fontFamily: 'monospace'
            }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid black',
                fontSize: '16px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              letterSpacing: '1px',
              fontFamily: 'monospace'
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid black',
                fontSize: '16px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{ 
              color: 'red', 
              fontSize: '14px', 
              marginBottom: '20px',
              fontFamily: 'monospace'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: 'black',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '2px',
              fontFamily: 'monospace'
            }}
          >
            ACCESS
          </button>
        </form>
        
        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}>
          Default: admin / calendar2024
        </div>
      </div>
    </div>
  );
};
