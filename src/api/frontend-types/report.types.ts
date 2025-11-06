/**
 * Report types
 * Generated from Go backend domain models
 */

/**
 * Report type
 */
export type ReportType = 'monthly' | 'quarterly' | 'custom';

/**
 * Report data
 */
export interface Report {
  filePath?: string;
  fileName: string;
  reportType: ReportType;
  period: string;
  generatedAt: string; // ISO 8601 timestamp
  fileSizeBytes: number;
  pdfData?: string; // Base64 encoded PDF
}

/**
 * Request parameters for generating monthly report
 */
export interface GenerateMonthlyReportParams {
  year: number; // 2020-2100
  month: number; // 1-12
}
