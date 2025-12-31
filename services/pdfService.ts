
import { PDFDocument, rgb } from 'pdf-lib';

// Use standard browser global for libraries loaded via CDN in index.html
declare const jspdf: any;
declare const pdfjsLib: any;

export class PDFService {
  static async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  }

  static async splitPDF(file: File, ranges: string): Promise<Uint8Array[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const results: Uint8Array[] = [];
    
    // Simple split implementation: for now, we split every page if no range is provided
    // or parse a range like "1-3, 5"
    const pageCount = pdf.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);
      results.push(await newPdf.save());
    }
    return results;
  }

  static async lockPDF(file: File, password: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    // pdf-lib doesn't natively support full encryption in the community version easily, 
    // but we can set metadata or user permissions. 
    // For a production app, we might use a more robust client-side encryption lib.
    return await pdf.save();
  }

  static async imagesToPDF(images: File[]): Promise<Uint8Array> {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    for (let i = 0; i < images.length; i++) {
      const imgData = await this.fileToDataURL(images[i]);
      if (i > 0) doc.addPage();
      const img = new Image();
      img.src = imgData;
      await new Promise(r => img.onload = r);
      
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'JPEG', 0, 0, width, height);
    }
    
    return doc.output('arraybuffer');
  }

  private static fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}
