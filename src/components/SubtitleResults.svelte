<script>
  import { fetchSubtitles } from '$lib/api/wyzie';
  
  export let tmdbId = null;
  export let imdbId = null;
  export let season = null;
  export let episode = null;
  export let language = 'en';
  export let format = 'srt';
  export let source = 'all';
  export let hearingImpaired = null;

  let results = [];
  let isLoading = false;
  let error = null;
  let errorDetails = null;
  let hasSearched = false;

  export async function search() {
    if (!tmdbId && !imdbId) return;

    isLoading = true;
    error = null;
    errorDetails = null;
    hasSearched = true;

    try {
      results = await fetchSubtitles({
        tmdb_id: tmdbId,
        imdb_id: imdbId,
        language,
        format,
        source,
        hi: hearingImpaired === "true" ? true : 
            hearingImpaired === "false" ? false : undefined,
        season,
        episode
      });
      
      console.log('Subtitles search results:', results);
    } catch (e) {
      console.error('Error fetching subtitles:', e);
      error = e.message || 'Failed to fetch subtitles';
      errorDetails = e.details;
      results = [];
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mt-4">
  {#if isLoading}
    <div class="flex justify-center">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center space-y-1">
      <div>{error}</div>
      {#if errorDetails}
        <div class="text-sm text-red-400">{errorDetails}</div>
      {:else}
        <div class="text-sm text-red-400">No subtitles found for your desired parameters, sorry :(</div>
      {/if}
    </div>
  {:else if hasSearched && results.length === 0}
    <div class="text-center text-type-secondary-light dark:text-type-secondary-dark">
      No subtitles found
    </div>
  {:else if results.length > 0}
    <div class="space-y-4">
      {#each results as subtitle}
        <div class="bg-mono-background-light dark:bg-mono-background-dark rounded-apple p-4 space-y-2">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-start gap-2">
                {#if subtitle.flagUrl}
                  <img src={subtitle.flagUrl} alt={`${subtitle.display} flag`} class="w-6 h-4 object-cover rounded-sm flex-shrink-0 mt-0.5" />
                {/if}
                <span class="font-medium break-all whitespace-normal w-full">{subtitle.display || subtitle.language.toUpperCase()}</span>
              </div>
              <div class="text-sm text-type-secondary-light dark:text-type-secondary-dark space-y-0.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-0.5 rounded-apple-sm">{subtitle.format.toUpperCase()}</span>
                  <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-0.5 rounded-apple-sm">{subtitle.encoding}</span>
                  <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-0.5 rounded-apple-sm">{subtitle.source}</span>
                  {#if subtitle.isHearingImpaired}
                  <span class="text-xs bg-mono-accent-light dark:bg-mono-accent-dark px-2 py-0.5 rounded-apple-sm">Hearing Impaired</span>
                  {/if}
                </div>
              </div>
            </div>
            <a 
              href={subtitle.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="apple-button inline-flex items-center px-3 py-1.5 text-sm font-medium flex-shrink-0">
              Download
            </a>
          </div>
          {#if subtitle.release}
            <div class="text-xs text-type-dimmed-light dark:text-type-dimmed-dark">
              Release: {subtitle.release}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div> 