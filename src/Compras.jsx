<<<<<<< HEAD
import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, doc, updateDoc, increment, getDocs, query, where } from "firebase/firestore"; 

const Compras = () => {
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("comida");

  const registrarCompra = async (e) => {
    e.preventDefault();
    if (!nombre || !costo || !cantidad) return alert("Completa todos los campos");

    try {
      // 1. Buscamos si el producto ya existe en la base de datos
      const q = query(collection(db, "productos"), where("nombre", "==", nombre.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // SI EXISTE: Actualizamos stock y precio
        const productoDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "productos", productoDoc.id), {
          cantidad: increment(Number(cantidad)),
          precio: Number(costo) * 1.20 // Ejemplo: Sugiere precio con 20% de ganancia
        });
      } else {
        // NO EXISTE: Lo creamos desde cero
        await addDoc(collection(db, "productos"), {
          nombre: nombre.toUpperCase(),
          precio: Number(costo) * 1.20,
          cantidad: Number(cantidad),
          categoria: categoria
        });
      }

      // 2. Registramos la transacción en una nueva colección de "compras" para tener historial
      await addDoc(collection(db, "historial_compras"), {
        producto: nombre.toUpperCase(),
        costo: Number(costo),
        cantidad: Number(cantidad),
        fecha: new Date()
      });

      setNombre(""); setCosto(""); setCantidad("");
      alert("✅ Compra registrada y Stock actualizado");
    } catch (error) {
      alert("Error al registrar compra");
    }
  };

  return (
    <div className="p-10 bg-slate-950 h-full text-white">
      <h2 className="text-3xl font-black text-yellow-400 mb-8 italic uppercase">📥 Registro de Compras (Entradas)</h2>
      <div className="max-w-xl bg-black border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={registrarCompra} className="space-y-4">
          <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="NOMBRE DEL PRODUCTO" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" className="bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="COSTO UNITARIO Bs" value={costo} onChange={(e) => setCosto(e.target.value)} />
            <input type="number" className="bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="CANTIDAD" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <select className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="comida">COMIDA</option>
            <option value="limpieza">LIMPIEZA</option>
            <option value="dulces">DULCES</option>
            <option value="bebidas">BEBIDAS</option>
            <option value="viveres">VIVERES</option>
          </select>
          <button className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:bg-yellow-500 uppercase tracking-tighter">Registrar Ingreso de Mercadería</button>
        </form>
      </div>
    </div>
  );
};

=======
import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, doc, updateDoc, increment, getDocs, query, where } from "firebase/firestore"; 

const Compras = () => {
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("comida");

  const registrarCompra = async (e) => {
    e.preventDefault();
    if (!nombre || !costo || !cantidad) return alert("Completa todos los campos");

    try {
      // 1. Buscamos si el producto ya existe en la base de datos
      const q = query(collection(db, "productos"), where("nombre", "==", nombre.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // SI EXISTE: Actualizamos stock y precio
        const productoDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "productos", productoDoc.id), {
          cantidad: increment(Number(cantidad)),
          precio: Number(costo) * 1.20 // Ejemplo: Sugiere precio con 20% de ganancia
        });
      } else {
        // NO EXISTE: Lo creamos desde cero
        await addDoc(collection(db, "productos"), {
          nombre: nombre.toUpperCase(),
          precio: Number(costo) * 1.20,
          cantidad: Number(cantidad),
          categoria: categoria
        });
      }

      // 2. Registramos la transacción en una nueva colección de "compras" para tener historial
      await addDoc(collection(db, "historial_compras"), {
        producto: nombre.toUpperCase(),
        costo: Number(costo),
        cantidad: Number(cantidad),
        fecha: new Date()
      });

      setNombre(""); setCosto(""); setCantidad("");
      alert("✅ Compra registrada y Stock actualizado");
    } catch (error) {
      alert("Error al registrar compra");
    }
  };

  return (
    <div className="p-10 bg-slate-950 h-full text-white">
      <h2 className="text-3xl font-black text-yellow-400 mb-8 italic uppercase">📥 Registro de Compras (Entradas)</h2>
      <div className="max-w-xl bg-black border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={registrarCompra} className="space-y-4">
          <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="NOMBRE DEL PRODUCTO" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" className="bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="COSTO UNITARIO Bs" value={costo} onChange={(e) => setCosto(e.target.value)} />
            <input type="number" className="bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" placeholder="CANTIDAD" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <select className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-transparent focus:border-yellow-400" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="comida">COMIDA</option>
            <option value="limpieza">LIMPIEZA</option>
            <option value="dulces">DULCES</option>
            <option value="bebidas">BEBIDAS</option>
            <option value="viveres">VIVERES</option>
          </select>
          <button className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:bg-yellow-500 uppercase tracking-tighter">Registrar Ingreso de Mercadería</button>
        </form>
      </div>
    </div>
  );
};

>>>>>>> 3646c24 (Historial y corrección de ventas funcional)
export default Compras;