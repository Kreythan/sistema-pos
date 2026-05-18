import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Cortes = () => {
  const [cortes, setCortes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "cortes"), orderBy("fechaCierre", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaFormateada: doc.data().fechaCierre?.toDate().toLocaleDateString('es-ES', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      }));
      setCortes(docs);
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-8 bg-slate-950 h-full overflow-y-auto text-white">
      <h2 className="text-3xl font-black text-yellow-400 mb-8 italic uppercase tracking-tighter">
        📊 Cortes de Caja (Arqueos)
      </h2>

      <div className="max-w-4xl overflow-hidden border border-white/10 rounded-[2rem] bg-black/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <th className="p-5">Fecha / Hora</th>
              <th className="p-5">Usuario</th>
              <th className="p-5 text-right">💵 Efectivo</th>
              <th className="p-5 text-right">📱 Pago QR</th>
              <th className="p-5 text-right text-yellow-400">💰 Total Turno</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-medium">
            {cortes.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-all">
                <td className="p-5 text-slate-400 font-mono text-xs">{c.fechaFormateada || "Procesando..."}</td>
                <td className="p-5 font-black uppercase text-yellow-400/90">{c.vendedor ? c.vendedor.split('@')[0] : 'Cajero'}</td>
                <td className="p-5 text-right text-slate-300">Bs {c.totalEfectivo?.toFixed(2)}</td>
                <td className="p-5 text-right text-slate-300">Bs {c.totalQR?.toFixed(2)}</td>
                <td className="p-5 text-right font-black text-green-400 text-base">Bs {c.totalGeneral?.toFixed(2)}</td>
              </tr>
            ))}
            {cortes.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-600 italic font-bold">
                  No se han realizado cierres de caja todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cortes;