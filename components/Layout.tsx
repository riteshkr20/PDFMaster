
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-lg">P</span>
            <span className="text-xl font-bold tracking-tight text-slate-800">PDFMaster</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">All Tools</Link>
            <Link to="/merge-pdf" className="hover:text-blue-600 transition-colors">Merge PDF</Link>
            <Link to="/compress-pdf" className="hover:text-blue-600 transition-colors">Compress</Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Go Pro</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-lg font-bold mb-4">PDFMaster</h3>
              <p className="max-w-md text-sm leading-relaxed">
                Empowering users with fast, private, and secure PDF tools. All processing is done locally in your browser. Your files never leave your device.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tools</h4>
              <ul className="text-sm space-y-2">
                <li><Link to="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
                <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link to="/excel-to-pdf" className="hover:text-white transition-colors">Excel to PDF</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} PDFMaster. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Secure Local Processing</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full my-auto"></span>
              <span>100% Private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
