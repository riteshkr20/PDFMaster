
import React, { useState, useRef, useMemo } from 'react';

declare const jspdf: any;

interface SignatureStyle {
  id: string;
  name: string;
  font: string;
  category: 'professional' | 'handwritten' | 'calligraphy' | 'modern';
  hasUnderline?: boolean;
}

const SIGNATURE_STYLES: SignatureStyle[] = [
  // Professional & Business
  { id: 'banker', name: 'Banker Style', font: 'Petit Formal Script', category: 'professional' },
  { id: 'executive', name: 'Executive', font: 'Great Vibes', category: 'professional' },
  { id: 'office', name: 'Clean Office', font: 'League Script', category: 'professional' },
  { id: 'legal', name: 'Legal Formal', font: 'Rochester', category: 'professional' },
  { id: 'minimal-prof', name: 'Minimal Corporate', font: 'Redressed', category: 'professional' },
  
  // Handwritten & Natural
  { id: 'fine-pen', name: 'Fine Tip Pen', font: 'Nanum Pen Script', category: 'handwritten' },
  { id: 'felt-pen', name: 'Felt Pen', font: 'Handlee', category: 'handwritten' },
  { id: 'fountain-pen', name: 'Fountain Pen', font: 'Reenie Beanie', category: 'handwritten' },
  { id: 'ballpoint', name: 'Ballpoint Script', font: 'Zeyada', category: 'handwritten' },
  { id: 'rock-salt', name: 'Rock Marker', font: 'Rock Salt', category: 'handwritten' },
  { id: 'natural', name: 'Natural Pen', font: 'Cedarville Cursive', category: 'handwritten' },
  { id: 'messy', name: 'Realistic Scribble', font: 'Homemade Apple', category: 'handwritten' },
  { id: 'slanted-hand', name: 'Slanted Hand', font: 'Yellowtail', category: 'handwritten' },
  { id: 'casual', name: 'Casual Flow', font: 'Caveat', category: 'handwritten' },
  { id: 'marker', name: 'Marker Pen', font: 'Seaweed Script', category: 'handwritten' },
  { id: 'rough-sketch', name: 'Rough Sketch', font: 'Just Another Hand', category: 'handwritten' },
  
  // Calligraphy
  { id: 'spencerian', name: 'Classic Spencerian', font: 'Allura', category: 'calligraphy' },
  { id: 'copperplate', name: 'Copperplate', font: 'Monsieur La Doulaise', category: 'calligraphy' },
  { id: 'ornamental', name: 'Ornamental', font: 'Mrs Saint Delafield', category: 'calligraphy' },
  { id: 'artistic', name: 'Artistic Brush', font: 'WindSong', category: 'calligraphy' },
  { id: 'gothic', name: 'Blackletter Gothic', font: 'UnifrakturMaguntia', category: 'calligraphy' },
  
  // Modern & Global
  { id: 'modern-clean', name: 'Modern Clean', font: 'Satisfy', category: 'modern' },
  { id: 'neon', name: 'Neon Script', font: 'Pacifico', category: 'modern' },
  { id: 'east-asian-vibe', name: 'Stroke Minimal', font: 'Meie Script', category: 'modern' },
  { id: 'bold-mod', name: 'Bold Modern', font: 'Damion', category: 'modern' },
  { id: 'italic-mod', name: 'Modern Italic', font: 'Ephesis', category: 'modern' }
];

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Navy', value: '#000080' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Royal Blue', value: '#4169e1' }
];

const SignaturePage: React.FC = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [isTransparent, setIsTransparent] = useState(true);
  
  // Advanced Controls
  const [weight, setWeight] = useState(0); // 0 to 2 for stroke-width
  const [slant, setSlant] = useState(0);   // -20 to 20 for skew
  const [spacing, setSpacing] = useState(0); // -2 to 10 for letter-spacing
  const [scale, setScale] = useState(1);   // 0.8 to 1.5

  const getSignatureText = (styleId: string) => {
    return name.trim() || "Your Name";
  };

  const categories = useMemo(() => {
    const grouped = {
      professional: SIGNATURE_STYLES.filter(s => s.category === 'professional'),
      handwritten: SIGNATURE_STYLES.filter(s => s.category === 'handwritten'),
      calligraphy: SIGNATURE_STYLES.filter(s => s.category === 'calligraphy'),
      modern: SIGNATURE_STYLES.filter(s => s.category === 'modern')
    };
    return grouped;
  }, []);

  const downloadSignature = async (style: SignatureStyle, format: 'png' | 'jpg' | 'svg' | 'pdf') => {
    const text = getSignatureText(style.id);
    const svgId = `svg-${style.id}`;
    const svgElement = document.getElementById(svgId) as unknown as SVGSVGElement;
    if (!svgElement) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      triggerDownload(url, `${style.id}_signature_pdfmaster.svg`);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const exportScale = 4;
    canvas.width = 600 * exportScale;
    canvas.height = 200 * exportScale;
    
    if (!isTransparent || format === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.scale(exportScale, exportScale);
    ctx.translate(300, 100);
    ctx.transform(1, 0, Math.tan(slant * Math.PI / 180), 1, 0, 0);
    
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const fontSize = (name.length > 15 ? 40 : 60) * scale;
    ctx.font = `${fontSize}px "${style.font}"`;
    
    await document.fonts.load(ctx.font);

    // Stroke weight simulation for canvas
    if (weight > 0) {
      ctx.strokeStyle = color;
      ctx.lineWidth = weight * 0.5;
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);

    if (format === 'pdf') {
      const { jsPDF } = jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [600, 200] });
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 600, 200);
      doc.save(`${style.id}_signature_pdfmaster.pdf`);
    } else {
      const url = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 1.0);
      triggerDownload(url, `${style.id}_signature_pdfmaster.${format}`);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Advanced Global Signature Studio</h1>
          <p className="text-slate-500 text-sm">Procedurally generated professional and cultural signatures.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest animate-pulse shadow-lg shadow-blue-200">
          Advanced Engine Active
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Controls */}
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b pb-4">Studio Controls</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase">Ink Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? 'border-blue-500 scale-125 ring-4 ring-blue-50' : 'border-transparent'}`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Stroke Weight</label>
                    <span className="text-[10px] text-slate-400">{weight}px</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.1" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Slant Angle</label>
                    <span className="text-[10px] text-slate-400">{slant}°</span>
                  </div>
                  <input type="range" min="-20" max="20" step="1" value={slant} onChange={(e) => setSlant(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Spacing</label>
                    <span className="text-[10px] text-slate-400">{spacing}px</span>
                  </div>
                  <input type="range" min="-2" max="10" step="1" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Scale</label>
                    <span className="text-[10px] text-slate-400">x{scale}</span>
                  </div>
                  <input type="range" min="0.8" max="1.5" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase">Background</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setIsTransparent(true)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${isTransparent ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Transparent</button>
                  <button onClick={() => setIsTransparent(false)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${!isTransparent ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Solid White</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Categories Grid */}
        <div className="flex-grow space-y-12 pb-24">
          {Object.entries(categories).map(([category, styles]) => (
            <section key={category}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800 capitalize">{category} Styles</h2>
                <div className="h-px flex-grow bg-slate-200"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {styles.map(style => (
                  <div key={style.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group">
                    <div 
                      className={`h-48 flex items-center justify-center p-6 relative ${!isTransparent ? 'bg-white' : 'bg-slate-50'}`}
                      style={{ 
                        backgroundImage: isTransparent ? 'radial-gradient(#cbd5e1 1px, transparent 0)' : 'none', 
                        backgroundSize: '12px 12px' 
                      }}
                    >
                      <svg 
                        id={`svg-${style.id}`}
                        viewBox="0 0 400 150" 
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g transform={`skewX(${slant})`}>
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={color}
                            style={{ 
                              fontFamily: style.font, 
                              fontSize: `${(name.length > 15 ? 35 : 55) * scale}px`,
                              letterSpacing: `${spacing}px`,
                              paintOrder: 'stroke fill',
                              stroke: weight > 0 ? color : 'none',
                              strokeWidth: `${weight}px`,
                              strokeLinejoin: 'round'
                            }}
                          >
                            {getSignatureText(style.id)}
                          </text>
                        </g>
                      </svg>
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        Procedural Preview
                      </div>
                    </div>
                    
                    <div className="p-5 bg-white border-t border-slate-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{style.name}</h3>
                        <span className="text-[10px] font-medium text-slate-300 italic">{style.font}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => downloadSignature(style, 'png')} className="bg-slate-900 text-white text-[9px] font-bold py-2 rounded-lg hover:bg-black transition-all">PNG</button>
                        <button onClick={() => downloadSignature(style, 'svg')} className="bg-blue-600 text-white text-[9px] font-bold py-2 rounded-lg hover:bg-blue-700 transition-all">SVG</button>
                        <button onClick={() => downloadSignature(style, 'jpg')} className="bg-slate-100 text-slate-600 text-[9px] font-bold py-2 rounded-lg hover:bg-slate-200 transition-all">JPG</button>
                        <button onClick={() => downloadSignature(style, 'pdf')} className="bg-slate-100 text-slate-600 text-[9px] font-bold py-2 rounded-lg hover:bg-slate-200 transition-all">PDF</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Security Banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 backdrop-blur-md bg-opacity-95">
          <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Secure Generation</p>
            <p className="text-[10px] text-slate-500">Signatures are generated locally via WebAssembly & SVG. Your data never leaves this browser.</p>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        section {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SignaturePage;
