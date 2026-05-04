<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, doc, updateDoc, increment } from "firebase/firestore"; 

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    });

    const manejarTeclado = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('btn-finalizar')?.click();
      }
    };

    window.addEventListener('keydown', manejarTeclado);
    return () => {
      unsub();
      window.removeEventListener('keydown', manejarTeclado);
    };
  }, [carrito]);

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && p.cantidad > 0
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      if (existe.cantidadSeleccionada < producto.cantidad) {
        setCarrito(carrito.map(item => 
          item.id === producto.id ? { ...item, cantidadSeleccionada: item.cantidadSeleccionada + 1 } : item
        ));
      } else {
        alert("Stock insuficiente");
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidadSeleccionada: 1 }]);
    }
  };

  // --- NUEVA FUNCIÓN: ELIMINAR ITEM INDIVIDUAL ---
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const cancelarVenta = () => {
    if (carrito.length > 0) {
      if (window.confirm("¿Vaciar la lista de venta actual?")) {
        setCarrito([]);
        setBusqueda("");
      }
    }
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const confirmar = window.confirm(`¿Confirmar venta por Bs ${totalVenta.toFixed(2)}?`);
    if (!confirmar) return;

    try {
      for (const item of carrito) {
        const productoRef = doc(db, "productos", item.id);
        await updateDoc(productoRef, {
          cantidad: increment(-item.cantidadSeleccionada)
        });
      }
      setCarrito([]);
      setBusqueda("");
      alert("✅ Venta procesada correctamente");
    } catch (error) {
      alert("❌ Error al descontar stock");
    }
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0);

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white">
      
      {/* IZQUIERDA: BUSCADOR */}
      <div className="flex-1 flex flex-col gap-6">
        <input 
          autoFocus
          className="w-full bg-black border-2 border-yellow-400/20 p-5 rounded-2xl outline-none focus:border-yellow-400 text-xl font-black placeholder:text-slate-700"
          placeholder="🔍 ESCRIBE PARA BUSCAR..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {productosFiltrados.map(p => (
            <button 
              key={p.id}
              onClick={() => agregarAlCarrito(p)}
              className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-left hover:border-yellow-400/50 transition-all group"
            >
              <p className="text-[10px] font-bold text-slate-500 uppercase">{p.categoria}</p>
              <p className="font-black text-white group-hover:text-yellow-400">{p.nombre}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-yellow-400 font-black">Bs {p.precio}</span>
                <span className="text-xs text-slate-500">Stock: {p.cantidad}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA: TICKET */}
      <div className="w-96 bg-black border border-white/10 rounded-[2.5rem] p-6 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
        
        <h2 className="text-xl font-black text-yellow-400 mb-6 italic text-center">DETALLE DE VENTA</h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
          {carrito.map(item => (
            <div key={item.id} className="group flex justify-between items-center bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">{item.nombre}</p>
                <p className="text-[10px] text-yellow-400 font-bold">{item.cantidadSeleccionada} x Bs {item.precio}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="font-black text-sm">Bs {(item.cantidadSeleccionada * item.precio).toFixed(2)}</p>
                
                {/* BOTÓN PARA ELIMINAR INDIVIDUALMENTE */}
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-red-500 hover:text-red-400 p-1 font-bold text-lg leading-none"
                  title="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {carrito.length === 0 && (
            <div className="text-center py-10 text-slate-700 font-bold italic border-2 border-dashed border-white/5 rounded-3xl">
              CARRITO VACÍO
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <span className="text-slate-500 font-bold text-xs uppercase">Total Neto</span>
            <span className="text-3xl font-black text-yellow-400 leading-none">Bs {totalVenta.toFixed(2)}</span>
          </div>
          
          <button 
            id="btn-finalizar"
            onClick={finalizarVenta}
            className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 flex flex-col items-center"
          >
            <span className="text-lg">CONFIRMAR VENTA</span>
            <span className="text-[10px] opacity-60 font-bold">(O PRESIONA F2)</span>
          </button>

          <button 
            onClick={cancelarVenta}
            className="w-full bg-transparent border border-red-500/30 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-500/10 transition-all text-xs uppercase tracking-widest"
          >
            Cancelar / Limpiar Todo
          </button>
        </div>
      </div>

    </div>
  );
};

=======
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Importamos también auth para saber quién vende
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore"; 

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    });

    const manejarTeclado = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('btn-finalizar')?.click();
      }
    };

    window.addEventListener('keydown', manejarTeclado);
    return () => {
      unsub();
      window.removeEventListener('keydown', manejarTeclado);
    };
  }, [carrito]);

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && p.cantidad > 0
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      if (existe.cantidadSeleccionada < producto.cantidad) {
        setCarrito(carrito.map(item => 
          item.id === producto.id ? { ...item, cantidadSeleccionada: item.cantidadSeleccionada + 1 } : item
        ));
      } else {
        alert("Stock insuficiente");
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidadSeleccionada: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const cancelarVenta = () => {
    if (carrito.length > 0) {
      if (window.confirm("¿Vaciar la lista de venta actual?")) {
        setCarrito([]);
        setBusqueda("");
      }
    }
  };

  // --- FUNCIÓN MODIFICADA: AHORA GUARDA EN EL HISTORIAL ---
  const finalizarVenta = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const confirmar = window.confirm(`¿Confirmar venta por Bs ${totalVenta.toFixed(2)}?`);
    if (!confirmar) return;

    try {
      // 1. GUARDAR LA VENTA EN LA COLECCIÓN "ventas" PARA EL HISTORIAL
      await addDoc(collection(db, "ventas"), {
        productos: carrito.map(item => ({
          nombre: item.nombre,
          precio: item.precio,
          cantidadVenta: item.cantidadSeleccionada
        })),
        total: totalVenta,
        fecha: serverTimestamp(), // Usamos la hora del servidor de Firebase
        vendedor: auth.currentUser?.email || "Desconocido"
      });

      // 2. ACTUALIZAR EL STOCK EN LA COLECCIÓN "productos"
      for (const item of carrito) {
        const productoRef = doc(db, "productos", item.id);
        await updateDoc(productoRef, {
          cantidad: increment(-item.cantidadSeleccionada)
        });
      }

      setCarrito([]);
      setBusqueda("");
      alert("✅ Venta procesada y guardada en el historial");
    } catch (error) {
      console.error("Error en la venta:", error);
      alert("❌ Error al procesar la venta");
    }
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0);

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white overflow-hidden">
      
      {/* IZQUIERDA: BUSCADOR */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <input 
          autoFocus
          className="w-full bg-black border-2 border-yellow-400/20 p-5 rounded-2xl outline-none focus:border-yellow-400 text-xl font-black placeholder:text-slate-700"
          placeholder="🔍 ESCRIBE PARA BUSCAR..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
          {productosFiltrados.map(p => (
            <button 
              key={p.id}
              onClick={() => agregarAlCarrito(p)}
              className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-left hover:border-yellow-400/50 transition-all group"
            >
              <p className="text-[10px] font-bold text-slate-500 uppercase">{p.categoria}</p>
              <p className="font-black text-white group-hover:text-yellow-400">{p.nombre}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-yellow-400 font-black">Bs {p.precio}</span>
                <span className="text-xs text-slate-500">Stock: {p.cantidad}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA: TICKET */}
      <div className="w-96 bg-black border border-white/10 rounded-[2.5rem] p-6 flex flex-col shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
        
        <h2 className="text-xl font-black text-yellow-400 mb-6 italic text-center">DETALLE DE VENTA</h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
          {carrito.map(item => (
            <div key={item.id} className="group flex justify-between items-center bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">{item.nombre}</p>
                <p className="text-[10px] text-yellow-400 font-bold">{item.cantidadSeleccionada} x Bs {item.precio}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="font-black text-sm">Bs {(item.cantidadSeleccionada * item.precio).toFixed(2)}</p>
                
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-red-500 hover:text-red-400 p-1 font-bold text-lg leading-none"
                  title="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {carrito.length === 0 && (
            <div className="text-center py-10 text-slate-700 font-bold italic border-2 border-dashed border-white/5 rounded-3xl">
              CARRITO VACÍO
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <span className="text-slate-500 font-bold text-xs uppercase">Total Neto</span>
            <span className="text-3xl font-black text-yellow-400 leading-none">Bs {totalVenta.toFixed(2)}</span>
          </div>
          
          <button 
            id="btn-finalizar"
            onClick={finalizarVenta}
            className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 flex flex-col items-center"
          >
            <span className="text-lg">CONFIRMAR VENTA</span>
            <span className="text-[10px] opacity-60 font-bold">(O PRESIONA F2)</span>
          </button>

          <button 
            onClick={cancelarVenta}
            className="w-full bg-transparent border border-red-500/30 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-500/10 transition-all text-xs uppercase tracking-widest"
          >
            Cancelar / Limpiar Todo
          </button>
        </div>
      </div>

    </div>
  );
};

>>>>>>> 3646c24 (Historial y corrección de ventas funcional)
export default Ventas;