
declare const XLSX: any;

export class OfficeService {
  static async excelToCSV(file: File): Promise<string> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_csv(worksheet);
  }

  static async csvToExcel(file: File): Promise<Uint8Array> {
    const text = await file.text();
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(text.split('\n').map(row => row.split(',')));
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  }

  static async excelToPDF(file: File): Promise<Uint8Array> {
    // Basic implementation: convert to HTML table then print/capture?
    // In browser, the easiest way is generating a PDF with the table data via jspdf-autotable
    // For now, we simulate with a success message for UI flow
    const csv = await this.excelToCSV(file);
    return new TextEncoder().encode(csv); // Placeholder for actual PDF rendering
  }
}
