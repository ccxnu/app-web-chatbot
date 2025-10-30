import { getAllParameters, parametersKeys } from "../system/parameters.api";

export interface Category {
  code: string;
  description: string;
}

/**
 * Query keys for category operations
 */
export const categoriesKeys = {
  all: ["categories"] as const,
};

/**
 * Get all document categories from parameters
 */
export const getDocumentCategories = async (): Promise<Category[]> => {
  try {
    const parameters = await getAllParameters({});

    // Filter parameters to get only DOCUMENT_CATEGORY ones
    const categories = parameters
      .filter((param: any) => param.name === "DOCUMENT_CATEGORY")
      .map((param: any) => ({
        code: param.code,
        description: param.description || param.code,
      }));

    return categories;
  } catch (error) {
    console.error("Error fetching document categories:", error);
    return [];
  }
};
