<script>
  import { createEventDispatcher } from 'svelte';
  import { debounce, searchTmdb, searchTmdbById } from '../lib/tmdb';
  
  export let contentTitle = '';
  export let directTmdbId = '';
  export let isLoading = false;
  export let searchResults = [];
  export let isSearchFocused = false;
  export let selectedContentType = 'tvshow';
  export let tmdbApiKey = '';

  const dispatch = createEventDispatcher();

  // Create a debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      searchResults = [];
      return;
    }

    isLoading = true;
    const searchType = selectedContentType === "movie" ? "movie" : "tv";
    searchResults = await searchTmdb(query, searchType, tmdbApiKey);
    isLoading = false;
  });

  async function handleTmdbIdSearch() {
    if (!directTmdbId.trim()) return;
    
    isLoading = true;
    const searchType = selectedContentType === "movie" ? "movie" : "tv";
    const result = await searchTmdbById(directTmdbId, searchType, tmdbApiKey);
    
    if (result) {
      contentTitle = result.title;
      dispatch('selectMedia', { 
        id: result.id, 
        title: result.title,
        imdbId: result.imdb_id
      });
      searchResults = [];
    }
    
    isLoading = false;
  }

  function selectMedia(media) {
    contentTitle = media.title || media.name;
    dispatch('selectMedia', { 
      id: media.id, 
      title: media.title || media.name,
      imdbId: media.external_ids?.imdb_id
    });
    searchResults = [];
    isSearchFocused = false;
  }

  $: if (contentTitle) {
    debouncedSearch(contentTitle);
  }

  $: if (directTmdbId) {
    handleTmdbIdSearch();
  }
</script>

<div class="flex flex-col gap-1 relative w-full">
  <div class="flex justify-between items-center mb-1">
    <label
      for="content-title"
      class="text-sm text-type-secondary">
      {selectedContentType === "movie" ? "Movie" : "TV Show"} Title:
    </label>
    <label
      for="direct-tmdb-id"
      class="text-sm text-type-secondary">
      Or enter TMDB ID:
    </label>
  </div>
  <div class="flex gap-2">
    <input
      type="text"
      id="content-title"
      bind:value={contentTitle}
      on:focus={() => {
        isSearchFocused = true;
      }}
      on:input={() => {
        directTmdbId = "";
      }}
      class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md flex-grow" />
    <input
      type="text"
      id="direct-tmdb-id"
      placeholder="TMDB ID"
      bind:value={directTmdbId}
      on:focus={() => {
        isSearchFocused = false;
        searchResults = [];
      }}
      on:input={() => {
        contentTitle = "";
      }}
      class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md w-32" />
  </div>

  {#if isLoading}
    <div class="absolute right-3 top-[38px]">
      <div
        class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin">
      </div>
    </div>
  {/if}

  {#if searchResults.length > 0 && isSearchFocused}
    <div
      id="search-results"
      class="absolute top-full left-0 right-0 bg-mono-background mt-2 py-1 rounded-md shadow-xl z-10">
      {#each searchResults as result}
        <button
          class="w-full text-left p-2 hover:bg-mono-accent2 flex items-center gap-3 transition duration-200"
          on:click={() => selectMedia(result)}>
          {#if result.poster_path}
            <img
              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
              alt={result.title || result.name}
              class="w-12 h-auto rounded" />
          {:else}
            <div class="w-12 h-[64px] bg-mono-secondary rounded"></div>
          {/if}
          <div>
            <p class="text-type-subheader">{result.title || result.name}</p>
            <p class="text-sm text-type-secondary">
              {result.release_date?.substring(0, 4) ||
                result.first_air_date?.substring(0, 4) ||
                "Unknown year"}
            </p>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div> 