/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} timeout - The timeout in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Search TMDB for movies or TV shows
 * @param {string} query - The search query
 * @param {string} type - The content type ('movie' or 'tv')
 * @param {string} apiKey - The TMDB API key
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchTmdb(query, type, apiKey) {
  if (!query.trim() || query.trim().length < 2) {
    return [];
  }

  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.slice(0, 3);
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}

/**
 * Search TMDB by ID
 * @param {string} id - The TMDB ID
 * @param {string} type - The content type ('movie' or 'tv')
 * @param {string} apiKey - The TMDB API key
 * @returns {Promise<Object|null>} - The media details or null if not found
 */
export async function searchTmdbById(id, type, apiKey) {
  if (!id.trim()) return null;

  const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.id) {
      return {
        id: data.id,
        title: data.title || data.name,
        type: type
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching TMDB by ID:", error);
    return null;
  }
} 