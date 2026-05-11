import React, { useState, useEffect } from 'react';

const AdminPanel = ({ token, API_URL, onGoBack }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [formData, setFormData] = useState({ id: null, titulo: '', precio: '', stock: '', categoria: '', imagen_url: '' });
  const [message, setMessage] = useState('');

  // Defensa en profundidad: Verificar si es admin antes de renderizar nada (RF11)
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

  const fetchGames = () => {
    setLoading(true);
    fetch(`${API_URL}/api/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (game) => {
    setFormData(game);
  };

  const handleCancelEdit = () => {
    setFormData({ id: null, titulo: '', precio: '', stock: '', categoria: '', imagen_url: '' });
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
    if (!window.confirm('¿Seguro que deseas eliminar este juego?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al eliminar');
      }

      setMessage('Juego eliminado');
      fetchGames();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          PANEL DE ADMINISTRACIÓN AVANZADA
        </h2>
        <button 
          onClick={onGoBack}
          className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver a la Tienda
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-semibold ${message.includes('Error') ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-green-900/50 text-green-300 border border-green-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de CRUD */}
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
                <input type="number" step="0.01" name="precio" required value={formData.precio} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Stock</label>
                <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Categoría</label>
              <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none" />
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
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando inventario...</td></tr>
                  ) : games.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hay juegos en la base de datos.</td></tr>
                  ) : (
                    games.map(game => (
                      <tr key={game.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="p-4 text-gray-500 text-sm">#{game.id}</td>
                        <td className="p-4 text-white font-medium">
                          {game.titulo}
                          <span className="block text-xs text-gray-500 mt-1">{game.categoria}</span>
                        </td>
                        <td className="p-4 text-cyan-400 font-semibold">{game.precio}€</td>
                        <td className="p-4 text-center">
                          {/* ALERTA VISUAL DE STOCK CRÍTICO (RF06) */}
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
    </div>
  );
};

export default AdminPanel;
