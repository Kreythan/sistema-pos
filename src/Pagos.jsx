import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore"; 

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");

  useEffect(() => {
    const q = query(collection(db, "pagos"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPagos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const registrarPago = async (e) => {
    e.preventDefault();
    if (!descripcion || !monto) return;
    await addDoc(collection(db, "pagos"), {
      descripcion: descripcion.toUpperCase(),
      monto: Number(monto),
      fecha: new Date()
    });
    setDescripcion(""); setMonto("");
  };

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white">
      <div className="flex-1">
        <h2 className="text-2xl font-black text-yellow-400 mb-6 italic">💸 HISTORIAL DE PAGOS / GASTOS</h2>
        <div className="space-y-3">
          {pagos.map(p => (
            <div key={p.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border-l-4 border-red-500">
              <div>
                <p className="font-bold">{p.descripcion}</p>
                <p className="text-[10px] text-slate-500">{p.fecha?.toDate().toLocaleDateString()}</p>
              </div>
              <p className="text-xl font-black text-red-400">Bs {p.monto}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-80">
        <div className="bg-black border border-white/10 p-6 rounded-4xl">
          <h3 className="text-lg font-black text-yellow-400 mb-6 text-center uppercase">Registrar Gasto</h3>
          <form onSubmit={registrarPago} className="space-y-4">
            <input className="w-full bg-slate-900 p-3 rounded-xl outline-none" placeholder="Descripción (Ej: Luz Abril)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <input type="number" className="w-full bg-slate-900 p-3 rounded-xl outline-none text-red-400 font-bold" placeholder="Monto Bs" value={monto} onChange={(e) => setMonto(e.target.value)} />
            <button className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 uppercase text-xs">Registrar Salida de Dinero</button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore"; 

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");

  useEffect(() => {
    const q = query(collection(db, "pagos"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPagos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const registrarPago = async (e) => {
    e.preventDefault();
    if (!descripcion || !monto) return;
    await addDoc(collection(db, "pagos"), {
      descripcion: descripcion.toUpperCase(),
      monto: Number(monto),
      fecha: new Date()
    });
    setDescripcion(""); setMonto("");
  };

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white">
      <div className="flex-1">
        <h2 className="text-2xl font-black text-yellow-400 mb-6 italic">💸 HISTORIAL DE PAGOS / GASTOS</h2>
        <div className="space-y-3">
          {pagos.map(p => (
            <div key={p.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border-l-4 border-red-500">
              <div>
                <p className="font-bold">{p.descripcion}</p>
                <p className="text-[10px] text-slate-500">{p.fecha?.toDate().toLocaleDateString()}</p>
              </div>
              <p className="text-xl font-black text-red-400">Bs {p.monto}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-80">
        <div className="bg-black border border-white/10 p-6 rounded-4xl">
          <h3 className="text-lg font-black text-yellow-400 mb-6 text-center uppercase">Registrar Gasto</h3>
          <form onSubmit={registrarPago} className="space-y-4">
            <input className="w-full bg-slate-900 p-3 rounded-xl outline-none" placeholder="Descripción (Ej: Luz Abril)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <input type="number" className="w-full bg-slate-900 p-3 rounded-xl outline-none text-red-400 font-bold" placeholder="Monto Bs" value={monto} onChange={(e) => setMonto(e.target.value)} />
            <button className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 uppercase text-xs">Registrar Salida de Dinero</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pagos;