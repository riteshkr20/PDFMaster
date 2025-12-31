
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import AdPlaceholder from '../components/AdPlaceholder';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pdf' | 'office' | 'image'>('all');

  const filteredTools = TOOLS.filter(tool => activeCategory === 'all' || tool.category === activeCategory);

  return (
    <div>
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Master Your Documents <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Fast, Free & Secure. Every tool you need to edit and convert PDFs, 100% in your browser.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['all', 'pdf', 'office', 'image'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Tools' : `${cat.toUpperCase()} Tools`}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map(tool => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
              {tool.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{tool.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>

      <AdPlaceholder slot="home-footer" />

      <section className="mt-24 py-16 bg-blue-600 rounded-3xl text-white text-center px-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose PDFMaster?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl mb-4">🛡️</div>
              <h4 className="font-bold text-xl mb-2">Private & Local</h4>
              <p className="text-blue-100 text-sm">No files ever leave your computer. Everything stays in your browser.</p>
            </div>
            <div>
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="font-bold text-xl mb-2">Instant Speed</h4>
              <p className="text-blue-100 text-sm">No waiting for server uploads. Conversions start immediately.</p>
            </div>
            <div>
              <div className="text-3xl mb-4">✨</div>
              <h4 className="font-bold text-xl mb-2">High Quality</h4>
              <p className="text-blue-100 text-sm">Professional algorithms ensure your documents look perfect.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </section>
    </div>
  );
};

export default HomePage;
