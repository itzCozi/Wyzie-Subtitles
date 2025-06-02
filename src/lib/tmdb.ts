/**
 * Utility function to debounce function calls
 * @param func - The function to debounce
 * @param timeout - The timeout in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  timeout: number = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

/**
 * Search result item from TMDB
 */
export interface TmdbSearchResult {
  id: number;
  title?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Media details returned by ID search
 */
export interface TmdbMediaDetails {
  id: number;
  title: string;
  type: 'movie' | 'tv';
}

/**
 * Search TMDB for movies or TV shows
 * @param query - The search query
 * @param type - The content type ('movie' or 'tv')
 * @param apiKey - The TMDB API key
 * @returns Array of search results
 */
export async function searchTmdb(
  query: string,
  type: 'movie' | 'tv',
  apiKey: string
): Promise<TmdbSearchResult[]> {
  if (!query.trim() || query.trim().length < 2) {
    return [];
  }

  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json() as { results: TmdbSearchResult[] };
    return data.results.slice(0, 3);
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}

/**
 * Search TMDB by ID
 * @param id - The TMDB ID
 * @param type - The content type ('movie' or 'tv')
 * @param apiKey - The TMDB API key
 * @returns The media details or null if not found
 */
export async function searchTmdbById(
  id: string,
  type: 'movie' | 'tv',
  apiKey: string
): Promise<TmdbMediaDetails | null> {
  if (!id.trim()) return null;

  const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json() as TmdbSearchResult;
    if (data.id) {
      return {
        id: data.id,
        title: data.title || data.name || '',
        type: type
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching TMDB by ID:", error);
    return null;
  }
}
