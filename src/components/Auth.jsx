import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth() {
  const [email, setEmail] = useState('paulokfk17@gmail.com');
  const [password, setPassword] = useState('Odiado@12');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error('Credenciais inválidas');
    else navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold">Login do Médico</h2>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          placeholder="Email"
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          placeholder="Senha"
        />
        <button 
          onClick={handleLogin}
          className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}