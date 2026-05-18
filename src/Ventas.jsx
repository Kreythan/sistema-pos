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

  // NUEVOS ESTADOS PARA EL MODAL DE PAGO INTERACTIVO
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState(null); // 'efectivo' o 'qr'
  const [pagaCon, setPagaCon] = useState("");
  const [presionandoQR, setPresionandoQR] = useState(false);
  const [progresoQR, setProgresoQR] = useState(0);

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

  // EFECTO NUEVO: Controla los 5 segundos manteniendo presionado para el QR
  useEffect(() => {
    let intervalo;
    if (presionandoQR) {
      intervalo = setInterval(() => {
        setProgresoQR((prev) => {
          if (prev >= 100) {
            clearInterval(intervalo);
            setPresionandoQR(false);
            ejecutarGuardadoVenta('qr'); // Guarda la venta automáticamente al completarse el 100%
            return 100;
          }
          return prev + 2; // Avanza un 2% cada 100ms (5 segundos en total)
        });
      }, 100);
    } else {
      setProgresoQR(0);
    }
    return () => clearInterval(intervalo);
  }, [presionandoQR]);

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

  // --- NUEVA LÓGICA DE PASOS PARA LA VENTA ---
  const iniciarPago = () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    setMetodoPago(null);
    setPagaCon("");
    setProgresoQR(0);
    setMostrarModalPago(true);
  };

  const ejecutarGuardadoVenta = async (metodo) => {
    try {
      // 1. GUARDAR LA VENTA CON EL MÉTODO DE PAGO CORRESPONDIENTE
      await addDoc(collection(db, "ventas"), {
        productos: carrito.map(item => ({
          nombre: item.nombre,
          precio: item.precio,
          amount: item.precio,
          cantidadVenta: item.cantidadSeleccionada
        })),
        total: totalVenta,
        metodoPago: metodo, // 'efectivo' o 'qr'
        fecha: serverTimestamp(),
        vendedor: auth.currentUser?.email || "Desconocido"
      });

      // 2. ACTUALIZAR EL STOCK EN LA BASE DE DATOS
      for (const item of carrito) {
        const productoRef = doc(db, "productos", item.id);
        await updateDoc(productoRef, {
          cantidad: increment(-item.cantidadSeleccionada)
        });
      }

      setCarrito([]);
      setBusqueda("");
      setMostrarModalPago(false);
      alert(`✅ Venta registrada con éxito en ${metodo.toUpperCase()}`);
    } catch (error) {
      console.error("Error en la venta:", error);
      alert("❌ Error al procesar la venta");
    }
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0);

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-950 text-white overflow-hidden relative">
      
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
            onClick={iniciarPago}
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

      {/* MODAL DE PAGO COMPLETO INTERACTIVO */}
      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-yellow-400/20 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            
            <button 
              onClick={() => setMostrarModalPago(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-yellow-400 italic text-center mb-2">PROCESAR PAGO</h3>
            <p className="text-center text-xl font-black text-white mb-6">Total: Bs {totalVenta.toFixed(2)}</p>

            {/* SELECCIÓN DE MÉTODO */}
            {!metodoPago ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMetodoPago('efectivo')}
                  className="bg-black border border-white/10 hover:border-yellow-400 p-6 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <span className="text-3xl">💵</span>
                  <span className="font-black text-xs uppercase tracking-wider group-hover:text-yellow-400">EFECTIVO</span>
                </button>
                <button 
                  onClick={() => setMetodoPago('qr')}
                  className="bg-black border border-white/10 hover:border-yellow-400 p-6 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <span className="text-3xl">📱</span>
                  <span className="font-black text-xs uppercase tracking-wider group-hover:text-yellow-400">PAGO QR</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* BOTÓN PARA VOLVER ATRÁS */}
                <button 
                  onClick={() => setMetodoPago(null)}
                  className="text-[10px] font-bold text-slate-500 hover:text-yellow-400 uppercase tracking-widest"
                >
                  ← Cambiar método
                </button>

                {/* FLUJO DE CAJA PARA EFECTIVO */}
                {metodoPago === 'efectivo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">¿Con cuánto paga el cliente?</label>
                      <input 
                        type="number"
                        autoFocus
                        placeholder="Monto en Bs"
                        value={pagaCon}
                        onChange={(e) => setPagaCon(e.target.value)}
                        className="w-full bg-black border border-white/10 focus:border-yellow-400 outline-none p-4 rounded-xl font-black text-xl text-yellow-400 placeholder:text-slate-800"
                      />
                    </div>

                    {parseFloat(pagaCon) >= totalVenta && (
                      <div className="bg-black/50 p-4 rounded-xl border border-green-500/20 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Cambio a devolver:</span>
                        <span className="text-2xl font-black text-green-400">Bs {(parseFloat(pagaCon) - totalVenta).toFixed(2)}</span>
                      </div>
                    )}

                    <button
                      disabled={!pagaCon || parseFloat(pagaCon) < totalVenta}
                      onClick={() => ejecutarGuardadoVenta('efectivo')}
                      className="w-full bg-green-500 text-black font-black py-4 rounded-xl uppercase text-sm tracking-wider hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all"
                    >
                      Registrar y Entregar Cambio
                    </button>
                  </div>
                )}

                {/* FLUJO SEGURO PARA PAGO POR QR */}
                {metodoPago === 'qr' && (
                  <div className="space-y-4 text-center">
                    <p className="text-xs text-slate-400">Verifica en tu teléfono que los <strong className="text-yellow-400">Bs {totalVenta.toFixed(2)}</strong> hayan ingresado a la cuenta antes de confirmar.</p>
                    
                    <div className="relative w-full bg-black h-14 rounded-xl overflow-hidden border border-white/10 select-none">
                      {/* Capa animada del progreso de la barra */}
                      <div 
                        className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-100"
                        style={{ width: `${progresoQR}%` }}
                      ></div>
                      
                      {/* Botón táctil / mouse interactivo */}
                      <button
                        onMouseDown={() => setPresionandoQR(true)}
                        onMouseUp={() => setPresionandoQR(false)}
                        onMouseLeave={() => setPresionandoQR(false)}
                        onTouchStart={() => setPresionandoQR(true)}
                        onTouchEnd={() => setPresionandoQR(false)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center font-black text-xs uppercase tracking-widest mix-blend-difference text-white cursor-pointer"
                      >
                        {presionandoQR ? "¡Mantén presionado!..." : "Mantén presionado 5s para confirmar"}
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-600 font-bold">
                      Progreso de verificación: {Math.round(progresoQR)}%
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Ventas;