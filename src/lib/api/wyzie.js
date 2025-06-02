import { searchSubtitles } from 'wyzie-lib';

/**
 * Custom error class for API errors
 */
class WyzieAPIError extends Error {
  constructor(response) {
    // Use the original message from the API response
    super(response.message);
    this.name = 'WyzieAPIError';
    this.status = response.code;
    this.response = response;
  }
}

/**
 * Fetch subtitles based on provided parameters
 * @param {Object} params - Search parameters
 * @param {string} [params.tmdbId] - TMDB ID
 * @param {string} [params.imdbId] - IMDB ID
 * @param {string} [params.language='en'] - Language code
 * @param {string} [params.format='srt'] - Subtitle format
 * @param {string} [params.source] - Source filter
 * @param {boolean} [params.hearingImpaired] - Hearing impaired filter
 * @param {number} [params.season] - Season number
 * @param {number} [params.episode] - Episode number
 * @returns {Promise<Array>} Array of subtitle results
 * @throws {WyzieAPIError} When the API returns an error
 */
export async function fetchSubtitles({
  tmdbId,
  imdbId,
  language = 'en',
  format = 'srt',
  source,
  hearingImpaired,
  season,
  episode
}) {
  if (!tmdbId && !imdbId) {
    throw new WyzieAPIError({
      code: 400,
      message: 'Missing required parameter',
      details: 'Either tmdbId or imdbId must be provided'
    });
  }

  const params = {
    format,
    language,
    source: source || 'all',
    hi: hearingImpaired === 'true' ? true : 
        hearingImpaired === 'false' ? false : 
        hearingImpaired === 'indifferent' ? undefined : undefined,
    ...(season && episode ? { season, episode } : {})
  };

  // Use IMDB ID if available, otherwise use TMDB ID
  if (imdbId) {
    params.imdb_id = imdbId;
  } else {
    params.tmdb_id = tmdbId;
  }

  try {
    return await searchSubtitles(params);
  } catch (error) {
    // If the error is already a WyzieAPIError, rethrow it
    if (error instanceof WyzieAPIError) {
      throw error;
    }

    // If the error has a response with data, parse it
    if (error.response?.data) {
      const apiError = error.response.data;
      throw new WyzieAPIError({
        code: apiError.code || error.status || 500,
        message: apiError.message || 'Failed to fetch subtitles',
        details: apiError.details || error.message
      });
    }

    // For network errors or other issues
    throw new WyzieAPIError({
      code: error.status || 500,
      message: 'Failed to fetch subtitles',
      details: error.message || 'An unexpected error occurred'
    });
  }
}
