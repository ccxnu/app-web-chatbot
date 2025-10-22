/**
 * Utilidades para documentos y chunks
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea el tamaño de contenido en palabras
 */
export function formatWordCount(text: string): string {
  const count = text.split(/\s+/).length;
  return `${count} palabra${count !== 1 ? "s" : ""}`;
}

/**
 * Trunca el texto a una longitud específica
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Valida que un documento tenga contenido suficiente
 */
export function validateDocumentContent(content: string, minWords: number = 10): boolean {
  const wordCount = content.split(/\s+/).length;
  return wordCount >= minWords;
}

/**
 * Genera categorías sugeridas basadas en el título
 */
export function suggestCategories(title: string): string[] {
  const titleLower = title.toLowerCase();
  const suggestions: string[] = [];

  if (titleLower.includes("política") || titleLower.includes("legal")) {
    suggestions.push("legal");
  }
  if (titleLower.includes("técnico") || titleLower.includes("api")) {
    suggestions.push("técnico");
  }
  if (titleLower.includes("faq") || titleLower.includes("pregunta")) {
    suggestions.push("faq");
  }
  if (titleLower.includes("tutorial") || titleLower.includes("guía")) {
    suggestions.push("tutorial");
  }
  if (titleLower.includes("configuración") || titleLower.includes("setup")) {
    suggestions.push("configuración");
  }

  return suggestions.length > 0 ? suggestions : ["general"];
}

/**
 * Calcula estadísticas de chunks
 */
export interface ChunkStatistics {
  totalChunks: number;
  totalWords: number;
  averageWordsPerChunk: number;
  minWords: number;
  maxWords: number;
}

export function calculateChunkStatistics(chunks: string[]): ChunkStatistics {
  const wordCounts = chunks.map((chunk) =>
    chunk.split(/\s+/).length
  );

  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);

  return {
    totalChunks: chunks.length,
    totalWords,
    averageWordsPerChunk:
      chunks.length > 0 ? Math.round(totalWords / chunks.length) : 0,
    minWords: Math.min(...wordCounts),
    maxWords: Math.max(...wordCounts),
  };
}
