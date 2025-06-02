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
  let hasSearched = false;

  export async function search() {
    if (!tmdbId && !imdbId) return;

    isLoading = true;
    error = null;
    errorDetails = null;
    hasSearched = true;

    try {
      results = await fetchSubtitles({
        tmdbId,
        imdbId,
        language,
        format,
        source,
        hearingImpaired,
        season,
        episode
      });
    } catch (e) {
      console.error('Error fetching subtitles:', e);
      results = [];
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mt-4">
  {#if isLoading}
    <div class="flex justify-center">
      <div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center space-y-1">
      <div>Failed to fetch subtitle</div>
      <div class="text-sm text-red-400">No subtitles found for your desired parameters, sorry :(</div>
    </div>
  {:else if hasSearched && results.length === 0}
    <div class="text-center text-type-secondary">
      No subtitles found
    </div>
  {:else if results.length > 0}
    <div class="space-y-4">
      {#each results as subtitle}
        <div class="bg-mono-background rounded-md p-4 space-y-2">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-start gap-2">
                {#if subtitle.flagUrl}
                  <img src={subtitle.flagUrl} alt={`${subtitle.display} flag`} class="w-6 h-4 object-cover rounded-sm flex-shrink-0 mt-0.5" />
                {/if}
                <span class="font-medium break-all whitespace-normal w-full">{subtitle.display || subtitle.language.toUpperCase()}</span>
              </div>
              <div class="text-sm text-type-secondary space-y-0.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs bg-mono-100 text-mono-800 px-2 py-0.5 rounded">{subtitle.format.toUpperCase()}</span>
                  <span class="text-xs bg-mono-100 text-mono-800 px-2 py-0.5 rounded">{subtitle.encoding}</span>
                  <span class="text-xs bg-mono-100 text-mono-800 px-2 py-0.5 rounded">{subtitle.source}</span>
                  {#if subtitle.isHearingImpaired}
                  <span class="text-xs bg-mono-100 text-mono-800 px-2 py-0.5 rounded">Hearing Impaired</span>
                  {/if}
                </div>
              </div>
            </div>
            <a 
              href={subtitle.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white hover:text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150 flex-shrink-0">
              Download
            </a>
          </div>
          {#if subtitle.release}
            <div class="text-xs text-type-dimmed">
              Release: {subtitle.release}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div> 