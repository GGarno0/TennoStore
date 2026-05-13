import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

const UserProfile = ({ user, token, API_URL, onLogout, onUpdateUser, onGoBack }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setShowConfirmUpdate(false);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateUser(data.user);
        setPassword(''); // Limpiar campo de contraseña
        setMessage({ text: '¡Perfil actualizado con éxito!', type: 'success' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
      // Limpiar mensaje tras 5 segundos
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const ordersHtml = orders.map((o, index) => {
      // Formatear los items del pedido para el PDF
      const itemsList = o.items && o.items.length > 0 
        ? o.items.map(item => `${item.titulo} (x${item.cantidad})`).join('<br>')
        : '<span style="color: #999;">Sin detalles</span>';

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 12px;">#${orders.length - index}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 12px;">${new Date(o.created_at).toLocaleDateString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 11px; line-height: 1.4;">${itemsList}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${parseFloat(o.total).toFixed(2)}€</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #10b981; font-weight: bold; font-size: 10px; text-transform: uppercase; text-align: center;">${o.status}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Informe de Usuario - TennoStore</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 28px; font-weight: 900; color: #7c3aed; text-transform: uppercase; letter-spacing: -1px; }
            .info { margin-bottom: 40px; background: #f8fafc; padding: 20px; rounded: 15px; border-left: 5px solid #22d3ee; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #1e293b; color: white; padding: 12px; font-size: 12px; text-transform: uppercase; }
            .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TennoStore</div>
            <div style="font-size: 12px; color: #64748b;">Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}</div>
          </div>
          <div class="info">
            <h1 style="margin-top: 0; color: #0f172a;">Informe de Actividad</h1>
            <p style="margin: 5px 0;"><strong>Cliente:</strong> ${user.username}</p>
            <p style="margin: 5px 0;"><strong>Correo:</strong> ${user.email || 'No disponible'}</p>
          </div>
          <h2 style="font-size: 18px; color: #334155; margin-bottom: 10px;">Historial Detallado de Compras</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 10%">Pedido</th>
                <th style="width: 15%">Fecha</th>
                <th style="width: 45%">Productos</th>
                <th style="width: 15%; text-align: right;">Total</th>
                <th style="width: 15%; text-align: center;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${ordersHtml || '<tr><td colspan="5" style="text-align:center; padding: 40px; color: #94a3b8;">No hay registros de compra</td></tr>'}
            </tbody>
          </table>
          <div class="footer">
            Este documento es un comprobante oficial de su actividad en TennoStore. <br>
            © ${new Date().getFullYear()} TennoStore Entertainment S.A.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Mi Perfil
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={handleExportPDF}
            className="text-xs font-bold text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-lg hover:bg-cyan-400/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Informe PDF
          </button>
          <button 
            onClick={onGoBack} 
            className="bg-gray-800/50 hover:bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-4 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h3 className="text-xl font-semibold mb-4 text-white">Editar Datos</h3>
          <form onSubmit={(e) => { e.preventDefault(); setShowConfirmUpdate(true); }} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Usuario</label>
              <input type="text" value={username} readOnly className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-gray-500 cursor-not-allowed outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nueva Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejar en blanco"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 pr-12 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors">
                  {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878l-4.242-4.242m4.242 4.242L9.878 9.878m4.242 4.242L19 19M5.5 5.5L18.5 18.5"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                </button>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-bold border ${message.type === 'success' ? 'bg-green-900/30 text-green-400 border-green-800/50' : 'bg-red-900/30 text-red-400 border-red-800/50'}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
              {loading ? 'Guardando...' : 'Actualizar Perfil'}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-gray-800">
            <button onClick={() => setShowConfirmDelete(true)} className="text-red-500 hover:text-red-400 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Eliminar mi cuenta
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 text-white">Pedidos Recientes</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">No hay pedidos.</p>
            ) : (
              orders.map((order, index) => (
                <div key={order.id} className="bg-gray-800/40 border border-gray-700/50 p-5 rounded-2xl flex justify-between items-center hover:border-gray-500 transition-all group">
                  <div>
                    <p className="text-white font-bold">#{orders.length - index}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 font-black uppercase tracking-tighter flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      Ver detalles <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-white font-black">{parseFloat(order.total).toFixed(2)}€</p>
                    <span className="text-[9px] uppercase font-bold text-green-400 bg-green-400/5 px-2 py-0.5 rounded border border-green-400/20">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-scale-in">
            {/* Header Modal */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 mb-1 block">Recibo de compra</span>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Detalle del Pedido</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">ID: #{selectedOrder.id}</span>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-gray-400 hover:text-white transition-all border border-white/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Lista de Items */}
            <div className="p-8 pt-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
                  <p className="text-gray-500 text-center py-12 italic text-sm bg-white/5 rounded-3xl border border-dashed border-white/10">Este pedido no tiene detalles registrados.</p>
                ) : (
                  selectedOrder.items.map((item, i) => (
                    <div key={i} className="group flex gap-5 items-center bg-white/5 hover:bg-white/[0.08] p-4 rounded-2xl border border-white/5 transition-all duration-300">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-sm leading-tight mb-1">{item.titulo}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {item.cantidad} x <span className="text-cyan-400/80">{parseFloat(item.precio).toFixed(2)}€</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-white font-black">{(item.cantidad * item.precio).toFixed(2)}<span className="text-xs ml-0.5 font-bold">€</span></p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Modal con el Total */}
            <div className="p-8 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Importe Total</p>
                  <span className="text-[10px] text-green-400/60 font-bold bg-green-400/5 px-2 py-0.5 rounded-full border border-green-400/10 uppercase">Pago Confirmado</span>
                </div>
                <div className="text-right">
                  <span className="text-4xl text-white font-black tracking-tighter">
                    {parseFloat(selectedOrder.total).toFixed(2)}<span className="text-xl ml-1 text-cyan-400">€</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showConfirmUpdate}
        title="Confirmar Cambios"
        message="¿Estás seguro de que deseas actualizar tus datos de perfil?"
        onConfirm={handleUpdate}
        onCancel={() => setShowConfirmUpdate(false)}
        type="info"
        confirmText="Sí, actualizar"
      />

      <ConfirmModal 
        isOpen={showConfirmDelete}
        title="Eliminar Cuenta"
        message="Esta acción es definitiva y perderás todo tu historial de pedidos. ¿Realmente quieres borrar tu cuenta?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        type="danger"
        confirmText="Borrar definitivamente"
      />
    </div>
  );
};

export default UserProfile;
