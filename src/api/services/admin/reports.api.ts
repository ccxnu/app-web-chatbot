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
 * Generate monthly report
 */
export const generateMonthlyReport = async (
  data: Record<string, unknown>,
  processName: string = "GENERATE_MONTHLY_REPORT"
) => {
  const body = withBody(data, processName);
  const { data: response } = await axiosClient.post<IResponse>(
    REPORTS_GENERATE_MONTHLY,
    body
  );
  return validateApiResponse(response);
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
