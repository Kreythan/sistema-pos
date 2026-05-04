import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ setUsuarioLogueado }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const acceder = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUsuarioLogueado(userCredential.user);
    } catch (error) {
      alert("Correo o contraseña incorrectos");
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
            placeholder="CORREO ELECTRÓNICO" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="CONTRASEÑA" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-yellow-500 transition-all">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ setUsuarioLogueado }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const acceder = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUsuarioLogueado(userCredential.user);
    } catch (error) {
      alert("Correo o contraseña incorrectos");
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
            placeholder="CORREO ELECTRÓNICO" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="CONTRASEÑA" 
            className="w-full bg-slate-900 p-4 rounded-2xl outline-none text-white border border-transparent focus:border-yellow-400"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-yellow-500 transition-all">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;