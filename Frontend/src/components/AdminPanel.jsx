import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

const AdminPanel = ({ token, API_URL, onGoBack }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' o 'users'
  
  // Datos del formulario de juegos
  const [formData, setFormData] = useState({ id: null, titulo: '', precio: '', stock: '', categoria: '', plataforma: 'PC', imagen_url: '' });
  
  // Datos de usuarios
  const [users, setUsers] = useState([]);
  const [userFormData, setUserFormData] = useState({ id: null, username: '', email: '', is_admin: false });
  
  const [gameSearchTerm, setGameSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [message, setMessage] = useState('');
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showConfirm = (title, message, onConfirm) => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm });
  };

  // Comprobamos si el usuario es administrador
  // Leemos el rol desde el token JWT
  const isAdmin = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.is_admin === true;
    } catch (e) {
      return false;
    }
  };

  if (!isAdmin()) {
    return (
      <div className="bg-red-900/20 border border-red-800 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h2>
        <p className="text-gray-300">No tienes permisos para acceder a esta sección.</p>
        <button onClick={onGoBack} className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-colors">
          Volver a la Tienda
        </button>
      </div>
    );
  }

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error('No tienes permisos suficientes (403)');
          if (res.status === 401) throw new Error('Sesión expirada o inválida (401)');
          throw new Error('Error al obtener los usuarios');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setMessage(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  const fetchGames = () => {
    setLoading(true);
    fetch(`${API_URL}/api/games`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los juegos');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          setGames([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setMessage(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  const handleExportAllUsersPDF = () => {
    const printWindow = window.open('', '_blank');
    const usersHtml = users.map(u => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">#${u.id}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.username}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.email || 'N/A'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.is_admin ? 'Administrador' : 'Cliente'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Listado de Clientes - TennoStore</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 40px; }
            .header { border-bottom: 2px solid #a855f7; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; }
            .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TennoStore - Administración</div>
            <div>Fecha: ${new Date().toLocaleDateString()}</div>
          </div>
          <h1>Listado de Usuarios Registrados</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              ${usersHtml}
            </tbody>
          </table>
          <div class="footer">Confidencial - Uso Interno TennoStore</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    if (activeTab === 'inventory') fetchGames();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (game) => {
    setFormData(game);
  };

  const handleCancelEdit = () => {
    setFormData({ id: null, titulo: '', precio: '', stock: '', categoria: '', plataforma: 'PC', imagen_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const isEditing = !!formData.id;
    const url = isEditing 
      ? `${API_URL}/api/games/${formData.id}` 
      : `${API_URL}/api/games`;
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al procesar la solicitud');
      }

      setMessage(isEditing ? 'Juego actualizado correctamente' : 'Juego creado correctamente');
      handleCancelEdit();
      fetchGames();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    showConfirm(
      '¿Eliminar Juego?',
      'Esta acción no se puede deshacer. El videojuego desaparecerá del catálogo para siempre.',
      async () => {
        try {
          const res = await fetch(`${API_URL}/api/games/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Error al eliminar');
          setMessage('Juego eliminado');
          fetchGames();
          setTimeout(() => setMessage(''), 3000);
        } catch (err) {
          setMessage(`Error: ${err.message}`);
        }
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    );
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-800 gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          PANEL ADMIN
        </h2>

        {/* Tabs de Navegación */}
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            INVENTARIO
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            USUARIOS
          </button>
        </div>

        <button 
          onClick={onGoBack}
          className="bg-gray-800/50 hover:bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/5 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a la Tienda
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-semibold ${message.includes('Error') ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-green-900/50 text-green-300 border border-green-800'}`}>
          {message}
        </div>
      )}

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de CRUD Juegos */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit sticky top-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-gray-700 pb-2">
              {formData.id ? 'Editar Videojuego' : 'Añadir Nuevo Juego'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Título</label>
                <input type="text" name="titulo" required value={formData.titulo} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Precio (€)</label>
                  <input type="number" step="0.01" min="0" name="precio" required value={formData.precio} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Stock</label>
                  <input type="number" min="0" name="stock" required value={formData.stock} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Categoría</label>
                <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-400 text-sm mb-1">Plataformas</label>
                <div className="grid grid-cols-2 gap-2">
                  {['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO'].map(plat => (
                    <label key={plat} className="flex items-center gap-2 bg-gray-900 border border-gray-600 rounded p-2 cursor-pointer hover:border-cyan-500 transition-colors">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-600 bg-gray-800 focus:ring-cyan-500 focus:ring-offset-gray-900"
                        checked={formData.plataforma?.split(',').map(s => s.trim()).includes(plat)}
                        onChange={(e) => {
                          const current = formData.plataforma?.split(',').map(s => s.trim()).filter(Boolean) || [];
                          const next = e.target.checked 
                            ? [...current, plat]
                            : current.filter(p => p !== plat);
                          setFormData(prev => ({ ...prev, plataforma: next.join(', ') }));
                        }}
                      />
                      <span className="text-xs text-white">{plat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">URL Imagen (Cloudinary)</label>
                <input type="text" name="imagen_url" value={formData.imagen_url || ''} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" placeholder="https://res.cloudinary.com/..." />
              </div>
              
              <div className="flex gap-3 pt-4">
                {formData.id && (
                  <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-2 rounded-lg shadow-lg transition-all">
                  {formData.id ? 'Guardar Cambios' : 'Añadir Juego'}
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Inventario */}
          <div className="lg:col-span-2">
            <div className="mb-4 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar en el inventario..." 
                value={gameSearchTerm}
                onChange={(e) => setGameSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-sm placeholder-gray-600"
              />
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900/80 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4 border-b border-gray-700">ID</th>
                      <th className="p-4 border-b border-gray-700">Título</th>
                      <th className="p-4 border-b border-gray-700">Precio</th>
                      <th className="p-4 border-b border-gray-700 text-center">Stock</th>
                      <th className="p-4 border-b border-gray-700 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {/* Filtro en cliente para búsqueda instantánea */}
                    {loading ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando inventario...</td></tr>
                    ) : games.filter(g => g.titulo.toLowerCase().includes(gameSearchTerm.toLowerCase())).length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-500">No se encontraron juegos.</td></tr>
                    ) : (
                      games
                        .filter(g => g.titulo.toLowerCase().includes(gameSearchTerm.toLowerCase()))
                        .sort((a, b) => {
                          if (!gameSearchTerm) return 0;
                          const aStarts = a.titulo.toLowerCase().startsWith(gameSearchTerm.toLowerCase());
                          const bStarts = b.titulo.toLowerCase().startsWith(gameSearchTerm.toLowerCase());
                          if (aStarts && !bStarts) return -1;
                          if (!aStarts && bStarts) return 1;
                          return a.titulo.localeCompare(b.titulo);
                        })
                        .map(game => (
                        <tr key={game.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="p-4 text-gray-500 text-sm">#{game.id}</td>
                          <td className="p-4 text-white font-medium">
                            {game.titulo}
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] bg-gray-900 px-1.5 py-0.5 rounded text-gray-400 border border-gray-700 uppercase">{game.categoria}</span>
                              <span className="text-[10px] bg-cyan-900/20 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-800/50 uppercase font-bold">{game.plataforma}</span>
                            </div>
                          </td>
                          <td className="p-4 text-cyan-400 font-semibold">{game.precio}€</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${game.stock < 5 ? 'bg-red-900/30 text-red-400 border-red-800/50 animate-pulse' : game.stock < 10 ? 'bg-orange-900/30 text-orange-400 border-orange-800/50' : 'bg-green-900/30 text-green-400 border-green-800/50'}`}>
                              {game.stock} un.
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => handleEditClick(game)} className="text-blue-400 hover:bg-blue-900/30 p-2 rounded transition-colors" title="Editar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(game.id)} className="text-red-400 hover:bg-red-900/30 p-2 rounded transition-colors" title="Eliminar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gestión de Usuarios */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-purple-400">
                {userFormData.id ? 'Editar Usuario' : 'Gestión de Usuarios'}
              </h3>
              <button 
                onClick={handleExportAllUsersPDF}
                className="bg-purple-900/40 text-purple-400 border border-purple-800/50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-purple-800/60 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                PDF Clientes
              </button>
            </div>
            
            {userFormData.id ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`${API_URL}/api/admin/users/${userFormData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(userFormData)
                  });
                  if (!res.ok) throw new Error('Error al actualizar');
                  setMessage('Usuario actualizado');
                  setUserFormData({ id: null, username: '', email: '', is_admin: false });
                  fetchUsers();
                  setTimeout(() => setMessage(''), 3000);
                } catch (err) { setMessage(err.message); }
              }} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nombre de Usuario</label>
                  <input type="text" value={userFormData.username} onChange={e => setUserFormData({...userFormData, username: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input type="email" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={userFormData.is_admin} onChange={e => setUserFormData({...userFormData, is_admin: e.target.checked})} className="form-checkbox h-5 w-5 text-purple-500" />
                  <label className="text-white font-bold">Administrador</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setUserFormData({ id: null, username: '', email: '', is_admin: false })} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-all shadow-lg">Guardar</button>
                </div>
              </form>
            ) : (
              <p className="text-gray-500 italic text-center py-8">Haz clic en el icono de editar de la tabla para modificar un usuario.</p>
            )}
          </div>

          {/* Tabla de Usuarios */}
          <div className="lg:col-span-2">
            <div className="mb-4 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar usuarios..." 
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all backdrop-blur-sm placeholder-gray-600"
              />
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900/80 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4 border-b border-gray-700">ID</th>
                      <th className="p-4 border-b border-gray-700">Usuario</th>
                      <th className="p-4 border-b border-gray-700">Rol</th>
                      <th className="p-4 border-b border-gray-700 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {loading ? (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500">Cargando usuarios...</td></tr>
                    ) : users.filter(u => u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase()))).length > 0 ? (
                      users
                        .filter(u => u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())))
                        .map(u => (
                        <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="p-4 text-gray-500 text-sm">#{u.id}</td>
                          <td className="p-4">
                            <div className="text-white font-medium">{u.username}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.is_admin ? 'bg-purple-900/40 text-purple-400 border border-purple-800/50' : 'bg-gray-900 text-gray-500 border border-gray-700'}`}>
                              {u.is_admin ? 'Admin' : 'Cliente'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setUserFormData(u)} className="text-purple-400 hover:bg-purple-900/30 p-2 rounded transition-colors" title="Editar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button onClick={async () => {
                              showConfirm(
                                '¿Eliminar Usuario?',
                                `¿Estás seguro de que deseas eliminar a "${u.username}"? Esta acción es irreversible.`,
                                async () => {
                                  try {
                                    const res = await fetch(`${API_URL}/api/admin/users/${u.id}`, {
                                      method: 'DELETE',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (!res.ok) throw new Error('Error al eliminar');
                                    notify('Usuario eliminado', 'success');
                                    fetchUsers();
                                  } catch (err) { notify(err.message, 'error'); }
                                  setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                }
                              );
                            }} className="text-red-400 hover:bg-red-900/30 p-2 rounded transition-colors" title="Eliminar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">No se encontraron usuarios en el sistema.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AdminPanel;
