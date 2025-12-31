
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'pdf' | 'office' | 'image';
  path: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ConversionState {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
  error?: string;
  downloadUrl?: string;
  fileName?: string;
}
