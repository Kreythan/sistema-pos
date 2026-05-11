import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"; 

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("comida");

  // ESTADOS PARA EDICIÓN
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editCategoria, setEditCategoria] = useState("");

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    });
    return () => unsub();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !cantidad) return;
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nombre.toUpperCase(),
        precio: Number(precio),
        cantidad: Number(cantidad),
        categoria: categoria,
        fecha: new Date()
      });
      setNombre(""); setPrecio(""); setCantidad("");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const eliminarProducto = async (id, nombreProducto) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${nombreProducto}" de Eco 360?`);
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "productos", id));
      } catch (err) {
        alert("Error al intentar eliminar el producto");
      }
    }
  };

  // FUNCIONES DE EDICIÓN
  const activarEdicion = (p) => {
    setEditandoId(p.id);
    setEditNombre(p.nombre);
    setEditPrecio(p.precio);
    setEditCategoria(p.categoria);
  };

  const guardarEdicion = async (id) => {
    try {
      const productoRef = doc(db, "productos", id);
      await updateDoc(productoRef, {
        nombre: editNombre.toUpperCase(),
        precio: Number(editPrecio),
        categoria: editCategoria
      });
      setEditandoId(null);
    } catch (err) {
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white">
      
      {/* SECCIÓN IZQUIERDA: LISTA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto pr-4">
        <h2 className="text-2xl font-black text-yellow-400 mb-6 flex items-center gap-2 italic">
          📦 STOCK ACTUAL <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full not-italic">{productos.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {productos.map(p => (
            <div key={p.id} className="relative bg-black/60 border border-white/5 p-5 rounded-3xl hover:border-red-500/30 transition-all group">
              
              {/* BOTONES DE ACCIÓN */}
              <div className="absolute -top-2 -left-2 flex gap-1 z-10">
                <button 
                  onClick={() => eliminarProducto(p.id, p.nombre)}
                  className="bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-red-700 hover:scale-110 transition-all shadow-lg border-2 border-slate-950"
                >
                  ✕
                </button>
                <button 
                  onClick={() => activarEdicion(p)}
                  className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-blue-700 hover:scale-110 transition-all shadow-lg border-2 border-slate-950"
                >
                  ✏️
                </button>
              </div>

              {editandoId === p.id ? (
                /* MODO EDICIÓN */
                <div className="space-y-3 pt-2">
                  <input 
                    className="w-full bg-slate-900 border border-yellow-400/50 p-2 rounded-xl text-xs outline-none"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                  />
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-yellow-400/50 p-2 rounded-xl text-xs outline-none text-yellow-400"
                    value={editPrecio}
                    onChange={(e) => setEditPrecio(e.target.value)}
                  />
                  <select 
                    className="w-full bg-slate-900 border border-yellow-400/50 p-2 rounded-xl text-xs outline-none"
                    value={editCategoria}
                    onChange={(e) => setEditCategoria(e.target.value)}
                  >
                    <option value="comida">COMIDA</option>
                    <option value="limpieza">LIMPIEZA</option>
                    <option value="dulces">DULCES</option>
                    <option value="bebidas">BEBIDAS</option>
                    <option value="viveres">VIVERES</option>
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => guardarEdicion(p.id)} className="flex-1 bg-green-600 text-[10px] font-bold py-2 rounded-lg hover:bg-green-700">GUARDAR</button>
                    <button onClick={() => setEditandoId(null)} className="flex-1 bg-slate-700 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-600">CANCELAR</button>
                  </div>
                </div>
              ) : (
                /* MODO VISTA */
                <>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                      {p.categoria}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${p.cantidad < 5 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      STOCK: {p.cantidad}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-black text-white mb-4 group-hover:text-yellow-400 transition-colors leading-tight">
                    {p.nombre}
                  </h3>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Precio Unitario</p>
                      <p className="text-xl font-black text-yellow-400">Bs {p.precio?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Total Valor</p>
                      <p className="text-sm font-bold text-slate-300">Bs {(p.precio * p.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <div className="w-80 shrink-0">
        <div className="bg-black border border-yellow-400/10 p-6 rounded-[2rem] sticky top-0 shadow-2xl">
          <h3 className="text-xl font-black text-yellow-400 mb-6 uppercase italic tracking-tighter text-center">Registrar Ingreso</h3>
          
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 ml-2 block">NOMBRE PRODUCTO</label>
              <input 
                className="w-full bg-slate-900 border border-slate-800 p-3 rounded-2xl focus:border-yellow-400 outline-none text-sm transition-all"
                placeholder="Ej: HARINA 1KG"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 ml-2 block">PRECIO (Bs)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-2xl focus:border-yellow-400 outline-none text-yellow-400 font-bold text-sm"
                  placeholder="0.00"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 ml-2 block">CANTIDAD</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-2xl focus:border-yellow-400 outline-none text-sm"
                  placeholder="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 ml-2 block">CATEGORÍA</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 p-3 rounded-2xl focus:border-yellow-400 outline-none text-sm text-slate-300 font-bold appearance-none cursor-pointer"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="comida">COMIDA</option>
                <option value="limpieza">LIMPIEZA</option>
                <option value="dulces">DULCES</option>
                <option value="bebidas">BEBIDAS</option>
                <option value="viveres">VIVERES</option>
              </select>
            </div>

            <div className="pt-4">
              <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/5 uppercase text-xs tracking-widest">
                Guardar en Inventario
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Inventario;