
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOOLS, MAX_FILE_SIZE } from '../constants';
import { ConversionState } from '../types';
import DropZone from '../components/DropZone';
import AdPlaceholder from '../components/AdPlaceholder';
import { PDFService } from '../services/pdfService';
import { OfficeService } from '../services/officeService';

// Access JSZip from CDN global
declare const JSZip: any;

const ToolPage: React.FC = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = TOOLS.find(t => t.path === `/${toolId}`);
  
  const [inputMethod, setInputMethod] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  useEffect(() => {
    if (!tool) navigate('/');
  }, [tool, navigate]);

  if (!tool) return null;

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setState({ status: 'processing', progress: 0, message: 'Initializing PDFMaster engine...' });
    
    try {
      let finalBlob: Blob;
      let finalFileName = '';

      // For tools that combine multiple files into one output
      if (tool.id === 'merge-pdf' || tool.id === 'jpg-to-pdf') {
        setState({ status: 'processing', progress: 50, message: `Combining ${files.length} files...` });
        let result: Uint8Array;
        if (tool.id === 'merge-pdf') {
          result = await PDFService.mergePDFs(files);
          finalFileName = 'merged_pdfmaster.pdf';
        } else {
          result = await PDFService.imagesToPDF(files);
          finalFileName = 'images_pdfmaster.pdf';
        }
        finalBlob = new Blob([result], { type: 'application/pdf' });
      } 
      // For tools that process files 1-to-1 (Bulk Mode)
      else {
        if (files.length === 1) {
          setState({ status: 'processing', progress: 50, message: 'Processing file...' });
          const result = await processSingleFile(files[0], tool.id);
          finalBlob = result.blob;
          finalFileName = result.name;
        } else {
          const zip = new JSZip();
          for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];
            const progress = Math.round(((i) / files.length) * 100);
            setState({ 
              status: 'processing', 
              progress, 
              message: `Processing (${i + 1}/${files.length}): ${currentFile.name}` 
            });
            
            const result = await processSingleFile(currentFile, tool.id);
            zip.file(result.name, result.blob);
          }
          setState({ status: 'processing', progress: 95, message: 'Creating ZIP archive...' });
          const zipContent = await zip.generateAsync({ type: 'blob' });
          finalBlob = zipContent;
          finalFileName = `PDFMaster_Bulk_${tool.id}.zip`;
        }
      }

      const url = URL.createObjectURL(finalBlob);
      setState({
        status: 'success',
        progress: 100,
        message: files.length > 1 && !['merge-pdf', 'jpg-to-pdf'].includes(tool.id) 
          ? `Successfully processed ${files.length} files!` 
          : 'Success! Your file is ready.',
        downloadUrl: url,
        fileName: finalFileName
      });

    } catch (err: any) {
      console.error(err);
      setState({
        status: 'error',
        progress: 0,
        message: 'Something went wrong during bulk processing.',
        error: err.message || 'Unknown error occurred.'
      });
    }
  };

  const processSingleFile = async (file: File, id: string): Promise<{ blob: Blob, name: string }> => {
    let result: Uint8Array | string;
    let ext = 'pdf';
    let mime = 'application/pdf';

    switch (id) {
      case 'excel-to-csv':
        result = await OfficeService.excelToCSV(file);
        ext = 'csv';
        mime = 'text/csv';
        break;
      case 'csv-to-excel':
        result = await OfficeService.csvToExcel(file);
        ext = 'xlsx';
        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf-to-excel':
        result = await OfficeService.excelToPDF(file); // Simulation
        ext = 'xlsx';
        break;
      default:
        // Generic fallback/simulation for other tools
        await new Promise(r => setTimeout(r, 800));
        result = new Uint8Array([0]);
        ext = 'pdf';
    }

    const blob = new Blob([result], { type: mime });
    const name = `${file.name.split('.')[0]}_pdfmaster.${ext}`;
    return { blob, name };
  };

  const handleDownload = () => {
    if (state.downloadUrl && state.fileName) {
      const a = document.createElement('a');
      a.href = state.downloadUrl;
      a.download = state.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const reset = () => {
    setFiles([]);
    setPastedText('');
    setState({ status: 'idle', progress: 0, message: '' });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    
    // Determine extension based on tool
    let ext = 'txt';
    if (tool.id.includes('csv')) ext = 'csv';
    else if (tool.id.includes('excel')) ext = 'csv'; // Paste as CSV often
    
    const virtualFile = new File([pastedText], `pasted_content_${Date.now()}.${ext}`, { type: 'text/plain' });
    setFiles(prev => [...prev, virtualFile]);
    setPastedText('');
    setInputMethod('upload'); // Switch back to see the queue
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">{tool.icon}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{tool.name}</h1>
        <p className="text-slate-600">{tool.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Bulk & Paste Support Active
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {state.status === 'idle' && (
          <div className="p-0">
            {/* Input Method Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setInputMethod('upload')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${inputMethod === 'upload' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Files
              </button>
              <button 
                onClick={() => setInputMethod('paste')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${inputMethod === 'paste' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Paste Content
              </button>
            </div>

            <div className="p-8">
              {inputMethod === 'upload' ? (
                <DropZone 
                  onFilesAdded={(newFiles) => setFiles(prev => [...prev, ...newFiles])} 
                  accept={tool.category === 'image' ? 'image/*' : (tool.category === 'pdf' ? '.pdf' : '.xlsx,.xls,.csv')}
                  multiple={true}
                  maxSizeMB={10}
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative group">
                    <textarea 
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder={tool.id.includes('csv') ? "Name,Email,Department\nJohn Doe,john@example.com,Sales\nJane Smith,jane@example.com,IT" : "Paste your raw file content here..."}
                      className="w-full h-64 p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl font-mono text-sm focus:border-blue-500 focus:ring-0 transition-all resize-none placeholder:text-slate-300"
                    />
                    <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest pointer-events-none">RAW CONTENT EDITOR</div>
                  </div>
                  <button 
                    onClick={handlePasteSubmit}
                    disabled={!pastedText.trim()}
                    className="mt-4 w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load as Virtual File
                  </button>
                </div>
              )}
              
              {files.length > 0 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800">Queue ({files.length} files):</h4>
                    <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:underline">Clear all</button>
                  </div>
                  <div className="space-y-2 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className={`${file.name.includes('pasted') ? 'text-amber-500' : 'text-blue-600'} flex-shrink-0`}>
                            {file.name.includes('pasted') ? '✍️' : '📄'}
                          </span>
                          <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(4)} MB</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleProcess}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    <span>Process All {files.length} Items</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {state.status === 'processing' && (
          <div className="p-16 text-center">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                {state.progress}%
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 truncate max-w-md mx-auto">{state.message}</h3>
            <p className="text-slate-500 text-sm">Please do not close your browser tab.</p>
          </div>
        )}

        {state.status === 'success' && (
          <div className="p-16 text-center">
            <div className="text-6xl mb-6 scale-up-center">✅</div>
            <h3 className="text-3xl font-bold text-slate-800 mb-2">{state.message}</h3>
            <p className="text-slate-500 mb-8">Processed locally for 100% privacy.</p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Result
              </button>
              <button
                onClick={reset}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                Start New Conversion
              </button>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="p-16 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error Occurred</h3>
            <p className="text-slate-600 mb-8">{state.error}</p>
            <button
              onClick={reset}
              className="bg-slate-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-900 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 space-y-8">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
          <div className="text-2xl text-amber-600">⌨️</div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">New: Paste Mode</h4>
            <p className="text-amber-800 text-sm">
              Don't have a file handy? Simply paste your raw data (like CSV rows or plain text) into the editor above. We'll turn it into a virtual file and process it instantly.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How PDFMaster Conversion Works</h2>
          <ol className="list-decimal pl-6 space-y-4 text-slate-600">
            <li>Select your preferred input method: <strong>Upload</strong> or <strong>Paste</strong>.</li>
            <li>Review your queue. You can mix uploaded files and pasted content!</li>
            <li>The PDFMaster local engine processes everything one-by-one inside your browser.</li>
            <li>Download your single result file or a convenient ZIP bundle.</li>
          </ol>
        </div>

        <AdPlaceholder slot="tool-page-sidebar" />
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes scale-up-center {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-up-center {
          animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        }
      `}</style>
    </div>
  );
};

export default ToolPage;
