<script>
  import { createEventDispatcher } from 'svelte';
  import { debounce, searchTmdb, searchTmdbById } from '../lib/tmdb';

  export let contentTitle = '';
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

    // Check if the input is potentially an ID
    const tmdbIdPattern = /^(t?\d{5,10})$/; // TMDB IDs are numeric
    const imdbIdPattern = /^(tt\d{7,8})$/i; // IMDb IDs start with 'tt' followed by 7-8 digits

    if (tmdbIdPattern.test(query) || imdbIdPattern.test(query)) {
      await handleIdSearch(query);
    } else {
      // Regular title search
      isLoading = true;
      const searchType = selectedContentType === "movie" ? "movie" : "tv";
      searchResults = await searchTmdb(query, searchType, tmdbApiKey);
      isLoading = false;
    }
  });

  async function handleIdSearch(id) {
    isLoading = true;
    const searchType = selectedContentType === "movie" ? "movie" : "tv";

    // Check if it's an IMDb ID (starts with tt)
    if (id.toLowerCase().startsWith('tt')) {
      console.log("IMDb ID search not yet implemented");
      isLoading = false;
      return;
    }

    // TMDB ID search
    const result = await searchTmdbById(id, searchType, tmdbApiKey);

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
</script>

<div class="flex flex-col gap-1 relative w-full">
  <label
    for="content-search"
    class="text-sm text-type-secondary-light dark:text-type-secondary-dark mb-1">
    Search by {selectedContentType === "movie" ? "Movie" : "TV Show"} Title or ID (TMDB/IMDb):
  </label>
  <input
    type="text"
    id="content-search"
    bind:value={contentTitle}
    on:focus={() => {
      isSearchFocused = true;
    }}
    placeholder="Enter title or ID (e.g. 12345 for TMDB, tt1234567 for IMDb)"
    class="fuji-input" />

  {#if isLoading}
    <div class="absolute right-3 top-[42px]">
      <div
        class="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin">
      </div>
    </div>
  {/if}

  {#if searchResults.length > 0 && isSearchFocused}
    <div
      id="search-results"
      class="absolute top-full left-0 right-0 mt-2 py-1 rounded-fuji z-10 
        bg-mono-background-light dark:bg-mono-background-dark 
        shadow-fuji-md dark:shadow-fuji-dark
        border border-mono-accent2-light dark:border-mono-accent2-dark">
      {#each searchResults as result}
        <button
          class="w-full text-left p-3 hover:bg-mono-accent-light dark:hover:bg-mono-accent-dark flex items-center gap-3 transition duration-200"
          on:click={() => selectMedia(result)}>
          {#if result.poster_path}
            <img
              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
              alt={result.title || result.name}
              class="w-12 h-auto rounded-fuji-sm" />
          {:else}
            <div class="w-12 h-[64px] bg-mono-accent-light dark:bg-mono-accent-dark rounded-fuji-sm"></div>
          {/if}
          <div>
            <p class="text-type-subheader-light dark:text-type-subheader-dark">{result.title || result.name}</p>
            <p class="text-sm text-type-secondary-light dark:text-type-secondary-dark">
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
