import React, { useState, useEffect } from 'react';
import Ventas from './Ventas';
import Inventario from './Inventario';
import Compras from './Compras';
import Pagos from './Pagos';
import Login from './Login'; // Asegúrate de haber creado este archivo
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
<<<<<<< HEAD
=======
import Historial from './Historial';
>>>>>>> 3646c24 (Historial y corrección de ventas funcional)

function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pantalla, setPantalla] = useState('ventas');

  // 1. ESCUCHAR SI HAY UN USUARIO CONECTADO
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUser(usuarioFirebase);
      setCargando(false);
    });
    return () => unsub();
  }, []);

  // 2. FUNCIÓN PARA CERRAR SESIÓN
  const salir = () => signOut(auth);

  // 3. DEFINIR SI ES ADMIN (Pon aquí tu correo de administrador)
  const isAdmin = user?.email === "admin@eco360.com"; 

  if (cargando) return <div className="h-screen bg-slate-950 flex items-center justify-center text-yellow-400 font-bold">CARGANDO ECO 360...</div>;

  // Si no hay usuario, mostramos el Login
  if (!user) return <Login />;

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans">
      
      {/* BARRA LATERAL */}
      <div className="w-64 bg-black border-r border-yellow-400/10 p-6 flex flex-col shrink-0">
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-black italic text-yellow-400 tracking-tighter">ECO 360</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">
            {isAdmin ? "Panel Administrador" : "Panel Cajero"}
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setPantalla('ventas')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold uppercase text-[11px] transition-all ${pantalla === 'ventas' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:bg-slate-900'}`}>
            🛒 Ventas
          </button>

<<<<<<< HEAD
=======
         


           {/* NUEVO BOTÓN HISTORIAL (Para ambos roles) */}
          <button 
           onClick={() => setPantalla('historial')} 
           className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold uppercase text-[11px] transition-all ${pantalla === 'historial' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:bg-slate-900'}`}>
        
              📜 Historial
          </button>

>>>>>>> 3646c24 (Historial y corrección de ventas funcional)
          {/* ESTOS BOTONES SOLO LOS VE EL ADMIN */}
          {isAdmin && (
            <>
              <button onClick={() => setPantalla('inventario')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold uppercase text-[11px] transition-all ${pantalla === 'inventario' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:bg-slate-900'}`}>
                📦 Inventario
              </button>
              <button onClick={() => setPantalla('compras')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold uppercase text-[11px] transition-all ${pantalla === 'compras' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:bg-slate-900'}`}>
                📥 Compras
              </button>
              <button onClick={() => setPantalla('pagos')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold uppercase text-[11px] transition-all ${pantalla === 'pagos' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:bg-slate-900'}`}>
                💸 Pagos
              </button>
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
          <div className="text-[10px] text-slate-500 truncate px-2">{user.email}</div>
          <button onClick={salir} className="w-full bg-red-600/10 text-red-500 py-3 rounded-xl text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <main className="flex-1 overflow-hidden relative">
        {pantalla === 'ventas' && <Ventas />}
<<<<<<< HEAD
=======
        {pantalla === 'historial' && <Historial />} {/* Añadir esto */}
>>>>>>> 3646c24 (Historial y corrección de ventas funcional)
        {pantalla === 'inventario' && isAdmin && <Inventario />}
        {pantalla === 'compras' && isAdmin && <Compras />}
        {pantalla === 'pagos' && isAdmin && <Pagos />}
      </main>

    </div>
  );
}

export default App;