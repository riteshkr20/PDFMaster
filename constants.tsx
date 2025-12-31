
import React from 'react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'signature-generator',
    name: 'Signature Generator',
    description: 'Create professional digital signatures for your documents.',
    icon: '✍️',
    category: 'pdf',
    path: '/signature-generator',
    seoTitle: 'Free Online Signature Generator - Create Digital Signatures - PDFMaster',
    seoDescription: 'Create professional, handwritten digital signatures online for free. Download as PNG, SVG, or PDF. 100% private and secure.'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files accurately.',
    icon: '📄',
    category: 'pdf',
    path: '/pdf-to-word',
    seoTitle: 'Free PDF to Word Converter Online - PDFMaster',
    seoDescription: 'Convert PDF to Word online for free. Extract text and layout from PDF to DOCX instantly with PDFMaster.'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert DOCX files into professional PDF documents.',
    icon: '📝',
    category: 'pdf',
    path: '/word-to-pdf',
    seoTitle: 'Convert Word to PDF Online Free - PDFMaster',
    seoDescription: 'Turn your Word documents into high-quality PDF files securely in your browser.'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document.',
    icon: '🔗',
    category: 'pdf',
    path: '/merge-pdf',
    seoTitle: 'Merge PDF Online - Combine PDF Files - PDFMaster',
    seoDescription: 'Join multiple PDF files into one document easily with PDFMaster. Fast, free, and secure.'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your PDF or save pages individually.',
    icon: '✂️',
    category: 'pdf',
    path: '/split-pdf',
    seoTitle: 'Split PDF Online - Extract Pages from PDF - PDFMaster',
    seoDescription: 'Split PDF files into individual pages or extract specific ranges easily.'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page into a high-quality JPG image.',
    icon: '🖼️',
    category: 'pdf',
    path: '/pdf-to-jpg',
    seoTitle: 'Convert PDF to JPG Online Free - PDFMaster',
    seoDescription: 'Extract images from PDF or convert pages to JPG images in seconds.'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert your images into a single PDF document.',
    icon: '📷',
    category: 'image',
    path: '/jpg-to-pdf',
    seoTitle: 'Convert JPG to PDF Online Free - PDFMaster',
    seoDescription: 'Combine multiple JPG, PNG, or BMP images into one professional PDF document.'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF with layout preserved.',
    icon: '📊',
    category: 'office',
    path: '/excel-to-pdf',
    seoTitle: 'Convert Excel to PDF Online Free - PDFMaster',
    seoDescription: 'Turn your XLSX or XLS spreadsheets into PDF documents instantly and securely.'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheets.',
    icon: '📉',
    category: 'office',
    path: '/pdf-to-excel',
    seoTitle: 'Convert PDF to Excel Online Free - PDFMaster',
    seoDescription: 'PDF to Excel converter. Extract data and tables from PDF to XLSX accurately.'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce the file size of your PDF without losing quality.',
    icon: '🗜️',
    category: 'pdf',
    path: '/compress-pdf',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size - PDFMaster',
    seoDescription: 'Shrink your PDF files for easier emailing and storage with PDFMaster.'
  },
  {
    id: 'lock-pdf',
    name: 'Lock PDF',
    description: 'Add a secure password to your PDF document.',
    icon: '🔒',
    category: 'pdf',
    path: '/lock-pdf',
    seoTitle: 'Password Protect PDF Online - Lock PDF - PDFMaster',
    seoDescription: 'Secure your sensitive PDF files with military-grade password protection.'
  },
  {
    id: 'excel-to-csv',
    name: 'Excel to CSV',
    description: 'Convert Excel sheets to CSV format instantly.',
    icon: '📋',
    category: 'office',
    path: '/excel-to-csv',
    seoTitle: 'Convert Excel to CSV Online Free - PDFMaster',
    seoDescription: 'Quickly export your Excel spreadsheet data to CSV files online.'
  },
  {
    id: 'csv-to-excel',
    name: 'CSV to Excel',
    description: 'Convert CSV data into formatted Excel spreadsheets.',
    icon: '📁',
    category: 'office',
    path: '/csv-to-excel',
    seoTitle: 'Convert CSV to Excel Online Free - PDFMaster',
    seoDescription: 'Import CSV files into professional Excel XLSX workbooks easily.'
  }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
