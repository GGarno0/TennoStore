import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-gray-950/80 backdrop-blur-2xl py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Columna Logo y Social */}
          <div className="md:col-span-4">
            <div className="text-4xl font-black mb-6 flex items-center gap-2 group cursor-default">
              <span className="w-2 h-10 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 tracking-tighter">
                TENNOSTORE
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-12">
              Elevando tu experiencia de juego al siguiente nivel. La tienda definitiva para el gamer moderno que busca calidad, seguridad y los mejores precios del mercado digital.
            </p>
            <div className="flex gap-4">
              {/* Iconos Redes Sociales Reales */}
              {[
                { name: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' },
                { name: 'Discord', path: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.666 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z' }
              ].map(social => (
                <a key={social.name} href="#" className="w-12 h-12 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces */}
          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              Navegación
            </h4>
            <ul className="space-y-4">
              {['Catálogo', 'Novedades', 'Ofertas', 'Mi Cuenta'].map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
              Soporte
            </h4>
            <ul className="space-y-4">
              {['Preguntas Frecuentes', 'Términos', 'Privacidad', 'Contacto'].map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm transition-all duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-purple-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Únete a la legión</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Suscríbete para recibir códigos de descuento exclusivos y noticias antes que nadie.</p>
            <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 group">
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="w-full bg-gray-900/60 py-4 pl-6 pr-16 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600"
              />
              <button className="absolute right-0 top-0 h-full bg-gradient-to-b from-purple-600 to-cyan-600 px-6 text-white hover:brightness-110 transition-all flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2026 TENNOSTORE — POWERED BY GAMERS
            </div>
            <div className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
              Todos los derechos reservados. Las marcas mencionadas son propiedad de sus respectivos dueños.
            </div>
          </div>
          
          <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
             {/* Simulación de logos de pago premium */}
             <div className="flex gap-8 items-center font-black italic text-gray-500 text-xs tracking-tighter">
                <span className="hover:text-white transition-colors cursor-default">VISA</span>
                <span className="hover:text-white transition-colors cursor-default">MASTERCARD</span>
                <span className="hover:text-white transition-colors cursor-default">PAYPAL</span>
                <span className="hover:text-white transition-colors cursor-default underline decoration-cyan-500">BITCOIN</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Luz decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </footer>
  );
};

export default Footer;
