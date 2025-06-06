<script>
  import { fetchSubtitles } from '$lib/api/wyzie';
  import { onMount } from 'svelte';
  
  export let tmdbId = null;
  export let imdbId = null;
  export let season = undefined;
  export let episode = undefined;
  export let language = 'en';
  export let format = 'srt';
  export let source = 'all';
  export let hearingImpaired = null;

  let results = [];
  let isLoading = false;
  let error = null;
  let errorDetails = null;
  let hasSearched = false;
  let isInitialized = false;

  onMount(() => {
    isInitialized = true;
    console.log("SubtitleResults component mounted");
  });

  export async function search() {
    console.log("SubtitleResults.search called with: ", {tmdbId, imdbId, season, episode, language, source, hearingImpaired});
    
    if (!tmdbId && !imdbId) {
      console.error("No ID provided for search");
      return Promise.reject('No ID provided');
    }

    isLoading = true;
    error = null;
    errorDetails = null;
    hasSearched = true;

    // Create a params object without season and episode if they're undefined
    const searchParams = {
      tmdb_id: tmdbId,
      imdb_id: imdbId,
      language,
      format,
      source,
      hi: hearingImpaired === "true" ? true : 
          hearingImpaired === "false" ? false : undefined
    };

    // Only add season and episode if they're defined
    if (season !== undefined && season !== null) {
      searchParams.season = season;
    }
    
    if (episode !== undefined && episode !== null) {
      searchParams.episode = episode;
    }

    try {
      console.log("Fetching subtitles...");
      results = await fetchSubtitles(searchParams);
      
      console.log('Subtitles search results:', results);
      return Promise.resolve(results);
    } catch (e) {
      console.error('Error fetching subtitles:', e);
      error = e.message || 'Failed to fetch subtitles';
      errorDetails = e.details;
      results = [];
      return Promise.reject(e);
    } finally {
      isLoading = false;
    }
  }
</script>

<div>
  {#if isLoading}
    <div class="flex justify-center py-8">
      <div class="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center space-y-1 py-6">
      <div class="font-medium">{error}</div>
      {#if errorDetails}
        <div class="text-sm text-red-400">{errorDetails}</div>
      {:else}
        <div class="text-sm text-red-400">No subtitles found for your desired parameters, sorry :(</div>
      {/if}
    </div>
  {:else if hasSearched && results.length === 0}
    <div class="text-center text-type-secondary-light dark:text-type-secondary-dark py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-3 text-mono-accent2-light dark:text-mono-accent2-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg font-medium">No subtitles found</p>
      <p class="text-sm mt-1">Try changing your search parameters</p>
    </div>
  {:else if results.length > 0}
    <div class="space-y-4 max-h-[600px] overflow-y-auto pr-1">
      {#each results as subtitle}
        <div class="bg-mono-background-light dark:bg-mono-background-dark rounded-apple p-4 border border-mono-accent-light dark:border-mono-accent-dark">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div class="space-y-2 min-w-0 flex-1">
              <div class="flex items-start gap-2">
                {#if subtitle.flagUrl}
                  <img src={subtitle.flagUrl} alt={`${subtitle.display} flag`} class="w-6 h-4 object-cover rounded-sm flex-shrink-0 mt-0.5" />
                {/if}
                <span class="font-medium text-type-emphasized-light dark:text-type-emphasized-dark break-all whitespace-normal w-full">
                  {subtitle.display || subtitle.language.toUpperCase()}
                </span>
              </div>
              
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-medium">{subtitle.format.toUpperCase()}</span>
                <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-1 rounded-full">{subtitle.encoding}</span>
                <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-1 rounded-full">{subtitle.source}</span>
                {#if subtitle.isHearingImpaired}
                <span class="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">Hearing Impaired</span>
                {/if}
              </div>
              
              {#if subtitle.release}
                <div class="text-xs text-type-dimmed-light dark:text-type-dimmed-dark">
                  <span class="font-medium">Release:</span> {subtitle.release}
                </div>
              {/if}
            </div>
            
            <a 
              href={subtitle.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="fuji-button !rounded-full flex items-center gap-1.5 !px-4 !py-2 text-sm font-medium flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 