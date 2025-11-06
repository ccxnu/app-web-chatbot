import type { IResponse } from "@/api/entities/response";
import { axiosClient } from "@/api/http/client";
import { withBody } from "@/api/http/request";
import { validateApiResponse } from "@/api/http/response";
import {
  REPORTS_GENERATE_MONTHLY,
  REPORTS_LIST,
  REPORTS_DOWNLOAD,
} from "../constant-routes";

/**
 * Query keys for report operations
 */
export const reportsKeys = {
  all: ["reports"] as const,
  list: () => ["reports", "list"] as const,
};

/**
 * Generate and download monthly report as PDF
 */
export const generateMonthlyReport = async (
  data: { year: number; month: number },
  processName: string = "GENERATE_MONTHLY_REPORT"
) => {
  const body = withBody(data, processName);
  const response = await axiosClient.post(
    REPORTS_GENERATE_MONTHLY,
    body,
    {
      responseType: 'blob', // Important: tell axios to expect binary data
    }
  );

  // Create a download link
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Extract filename from Content-Disposition header or use default
  const contentDisposition = response.headers['content-disposition'];
  let filename = `reporte_mensual_${data.year}_${data.month}.pdf`;
  if (contentDisposition) {
    const matches = /filename="([^"]+)"/.exec(contentDisposition);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return { success: true, filename };
};

/**
 * List all available reports
 */
export const listReports = async (
  data: Record<string, unknown> = {},
  processName: string = "LIST_REPORTS"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    REPORTS_LIST,
    body
  );
  return validateApiResponse(response);
};

/**
 * Download a report file
 * Note: This returns the download URL, not the file content
 */
export const getReportDownloadUrl = (filename: string): string => {
  return `${REPORTS_DOWNLOAD}/${filename}`;
};
