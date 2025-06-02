import { type SearchSubtitlesParams, type SubtitleData, searchSubtitles } from 'wyzie-lib';

/**
 * Response structure from the API
 */
interface WyzieErrorResponse {
  code: number;
  message: string;
  details?: string;
}

/**
 * Custom error class for API errors
 */
class WyzieAPIError extends Error {
  status: number;
  response: WyzieErrorResponse;

  constructor(response: WyzieErrorResponse) {
    // Use the original message from the API response
    super(response.message);
    this.name = 'WyzieAPIError';
    this.status = response.code;
    this.response = response;
  }
}

/**
 * Internal parameters for the subtitle search API
 */
interface ApiSearchParams {
  format: string;
  language: string;
  source: string;
  hi?: boolean;
  season?: number;
  episode?: number;
  tmdb_id?: string;
  imdb_id?: string;
}

/**
 * Fetch subtitles based on provided parameters
 * @param params - Search parameters
 * @returns Array of subtitle results
 * @throws {WyzieAPIError} When the API returns an error
 */
export async function fetchSubtitles({
  tmdb_id,
  imdb_id,
  language = 'en',
  format = 'srt',
  source,
  hi,
  season,
  episode
}: SearchSubtitlesParams): Promise<SubtitleData[]> {
  if (!tmdb_id && !imdb_id) {
    throw new WyzieAPIError({
      code: 400,
      message: 'Missing required parameter',
      details: 'Either tmdbId or imdbId must be provided'
    });
  }

  // Prepare the base parameters
  const baseParams = {
    language,
    format,
    source: source || 'all',
    ...(hi === true ? { hi: true } :
       hi === false ? { hi: false } : {}),
  };

  let searchParams: SearchSubtitlesParams;

  if (imdb_id) {
    if (season !== undefined && episode !== undefined) {
      // Both season and episode are provided
      searchParams = {
        imdb_id,
        ...baseParams,
        season,
        episode
      };
    } else {
      // Neither season nor episode is provided
      searchParams = {
        imdb_id,
        ...baseParams
      };
    }
  } else {
    // Convert tmdbId to number if it's a string
    const tmdbIdNumber = typeof tmdb_id === 'string' ? parseInt(tmdb_id, 10) : tmdb_id;

    if (season !== undefined && episode !== undefined) {
      // Both season and episode are provided
      searchParams = {
        tmdb_id: tmdbIdNumber as number,
        ...baseParams,
        season,
        episode
      };
    } else {
      // Neither season nor episode is provided
      searchParams = {
        tmdb_id: tmdbIdNumber as number,
        ...baseParams
      };
    }
  }

  try {
    return await searchSubtitles(searchParams);
  } catch (error: any) {
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
