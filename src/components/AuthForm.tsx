
import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (username: string, password: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(username, password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="border-4 border-black p-8 bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
          CALENDAR ACCESS
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:border-gray-600 font-mono"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:border-gray-600 font-mono"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors tracking-wide"
          >
            ACCESS
          </button>
        </form>
      </div>
    </div>
  );
};
