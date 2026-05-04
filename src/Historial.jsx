import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Historial = () => {
  const [ventas, setVentas] = useState([]);
  const [diaAbierto, setDiaAbierto] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaFormateada: doc.data().fecha?.toDate().toLocaleDateString('es-ES', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        })
      }));

      // Agrupar por fecha
      const agrupado = docs.reduce((acc, venta) => {
        const fecha = venta.fechaFormateada;
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(venta);
        return acc;
      }, {});
      
      setVentas(agrupado);
    });
    return () => unsub();
  }, []);

  const toggleDia = (fecha) => {
    setDiaAbierto(diaAbierto === fecha ? null : fecha);
  };

  return (
    <div className="p-8 bg-slate-950 h-full overflow-y-auto text-white">
      <h2 className="text-3xl font-black text-yellow-400 mb-8 italic uppercase tracking-tighter">
        📜 Historial de Ventas
      </h2>

      <div className="space-y-4 max-w-4xl">
        {Object.keys(ventas).length === 0 && (
          <p className="text-slate-500 italic">No hay ventas registradas aún.</p>
        )}

        {Object.keys(ventas).map((fecha) => (
          <div key={fecha} className="border border-white/10 rounded-[2rem] overflow-hidden bg-black/40">
            {/* CABECERA DEL DÍA */}
            <button 
              onClick={() => toggleDia(fecha)}
              className="w-full flex justify-between items-center p-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-yellow-400">{fecha}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded-lg text-slate-400 uppercase font-bold">
                  {ventas[fecha].length} Ventas
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Total del día</p>
                <p className="text-xl font-black text-green-400">
                  Bs {ventas[fecha].reduce((total, v) => total + v.total, 0).toFixed(2)}
                </p>
              </div>
            </button>

            {/* DETALLE DESPLEGABLE */}
            {diaAbierto === fecha && (
              <div className="p-6 bg-black/60 border-t border-white/5 space-y-3">
                {ventas[fecha].map((v) => (
                  <div key={v.id} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-500">
                        🕒 {v.fecha?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-sm font-black text-yellow-400">Total: Bs {v.total.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {v.productos.map((prod, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-slate-300">• {prod.nombre} (x{prod.cantidadVenta})</span>
                          <span className="text-slate-500">Bs {(prod.precio * prod.cantidadVenta).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;