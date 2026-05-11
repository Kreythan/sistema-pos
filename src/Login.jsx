import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cargando, setCargando] = useState(false);

  const acceder = async (e) => {
    e.preventDefault();
    if (cargando) return; // Evita múltiples clics

    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // No necesitas setUsuarioLogueado. 
      // Firebase avisará a App.jsx automáticamente.
    } catch (error) {
      console.error("Error de login:", error.code);
      alert("⚠️ Correo o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950">
      <div className="bg-black border border-yellow-400/20 p-10 rounded-[3rem] w-96 shadow-2xl">
        <h1 className="text-4xl font-black text-yellow-400 italic mb-2 text-center">ECO 360</h1>
        <p className="text-slate-500 text-center text-[10px] font-bold tracking-[0.3em] mb-8 uppercase">Acceso al Sistema</p>
        
        <form onSubmit={acceder} className="space-y-4">
          <input 
            type="email" 
            required
            placeholder="CORREO ELECTRÓNICO" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            required
            placeholder="CONTRASEÑA" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400 transition-all"
            onChange={(e) => setPass(e.target.value)}
          />
          <button 
            disabled={cargando}
            className={`w-full ${cargando ? 'bg-slate-700 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-black font-black py-4 rounded-2xl uppercase tracking-widest transition-all`}
          >
            {cargando ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;