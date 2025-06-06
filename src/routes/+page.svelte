<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import MediaTypeSelector from "../components/MediaTypeSelector.svelte";
  import SearchInput from "../components/SearchInput.svelte";
  import FilterOptions from "../components/FilterOptions.svelte";
  import EpisodeSelector from "../components/EpisodeSelector.svelte";
  import SubtitleResults from "../components/SubtitleResults.svelte";

  let selectedContentType = "tvshow";
  let season = 1;
  let episode = 1;
  let imdbId = "";
  let language = "en";
  let source = "all";
  let hearingImpaired = "indifferent";
  let contentTitle = "";
  let searchResults = [];
  let isLoading = false;
  let selectedTmdbId = null;
  let tmdbApiKey = "9867f3f6a5e78a2639afb0e2ffc0a311";
  let isSearchFocused = false;
  let directTmdbId = "";
  let subtitleResultsComponent;
  let isSearchButtonLoading = false;
  let hasSearched = false;

  // Add function to handle clicking outside
  function handleClickOutside(event) {
    if (!browser) return; // Early return if not in browser

    const searchElement = document.getElementById("content-title");
    const resultsElement = document.getElementById("search-results");

    if (
      searchElement &&
      resultsElement &&
      !searchElement.contains(event.target) &&
      !resultsElement.contains(event.target)
    ) {
      isSearchFocused = false;
    }
  }

  onMount(() => {
    if (browser) {
      // Only add event listener if in browser
      document.addEventListener("click", handleClickOutside);
    }
  });

  onDestroy(() => {
    if (browser) {
      // Only remove event listener if in browser
      document.removeEventListener("click", handleClickOutside);
    }
  });

  function handleSelectMedia(event) {
    selectedTmdbId = event.detail.id;
    contentTitle = event.detail.title;
    imdbId = event.detail.imdbId || "";
    
    // Clear season and episode if it's a movie
    if (selectedContentType === "movie") {
      season = null;
      episode = null;
    }
  }

  function handleSearch() {
    if (!selectedTmdbId) return;
    
    isSearchButtonLoading = true;
    
    // Initialize the component if it hasn't been created yet
    if (!subtitleResultsComponent) {
      console.error("Subtitle results component not initialized!");
      isSearchButtonLoading = false;
      return;
    }
    
    subtitleResultsComponent.search()
      .then((results) => {
        console.log("Search completed successfully:", results);
        hasSearched = true;
        isSearchButtonLoading = false;
      })
      .catch((error) => {
        console.error("Search failed:", error);
        hasSearched = true;
        isSearchButtonLoading = false;
      });
  }

  // Watch for content type changes to clear season/episode for movies
  $: if (selectedContentType === "movie") {
    season = null;
    episode = null;
  }

  $: searchUrl =
    selectedContentType === "movie" ?
      `/search?id=${imdbId}&tmdb=${selectedTmdbId}`
    : `/search?id=${imdbId}&tmdb=${selectedTmdbId}&season=${season}&episode=${episode}&language=${language}`;
</script>

<div>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-grow mt-8 mx-auto px-6 pb-10 max-w-3xl w-full">
      <!-- Search -->
      <div class="fuji-card p-8 flex flex-col gap-5 mb-6">
        <span>
          <h3 class="font-semibold text-type-subheader-light dark:text-type-subheader-dark text-2xl mb-2">Subtitles for Free</h3>
          <p class="text-type-dimmed-light dark:text-type-dimmed-dark text-sm">
            Search and download free subtitles for movies and TV shows instantly. Enter the title,
            select the content type, and search the Wyzie API for any available subtitles.
          </p>
        </span>

        <div class="flex justify-center items-center gap-4">
          <MediaTypeSelector bind:selectedContentType={selectedContentType} />

          <SearchInput
            bind:contentTitle
            bind:directTmdbId
            bind:isLoading
            bind:searchResults
            bind:isSearchFocused
            {selectedContentType}
            {tmdbApiKey}
            on:selectMedia={handleSelectMedia}
          />
        </div>

        <FilterOptions
          bind:language
          bind:source
          bind:hearingImpaired
        />

        {#if selectedContentType === "tvshow"}
          <EpisodeSelector
            bind:season
            bind:episode
          />
        {/if}

        <button
          type="button"
          class="fuji-button !rounded-md mt-2 inline-flex justify-center items-center"
          disabled={isSearchButtonLoading || !selectedTmdbId}
          on:click={() => {
            if (selectedTmdbId && !isSearchButtonLoading) {
              console.log("Initiating search...");
              handleSearch();
            }
          }}>
          {#if isSearchButtonLoading}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Searching...
          {:else}
            Search {selectedContentType === "movie" ? "Movie" : "TV Show"}
          {/if}
        </button>
      </div>

      <!-- Results -->
      <div class="fuji-card p-6 {hasSearched ? '' : 'hidden'}">
        {#if contentTitle}
          <div class="mb-4 pb-3 border-b border-mono-accent2-light dark:border-mono-accent2-dark">
            <h3 class="font-medium text-type-subheader-light dark:text-type-subheader-dark text-xl">
              Results for: <span class="font-semibold">{contentTitle}</span>
              {#if selectedContentType === "tvshow" && season !== null && episode !== null}
                <span class="text-sm text-type-secondary-light dark:text-type-secondary-dark ml-2">
                  S{season}:E{episode}
                </span>
              {/if}
            </h3>
          </div>
        {/if}
        
        <SubtitleResults
          bind:this={subtitleResultsComponent}
          tmdbId={selectedTmdbId}
          imdbId={imdbId}
          language={language}
          source={source}
          hearingImpaired={hearingImpaired}
          season={selectedContentType === "tvshow" ? season : undefined}
          episode={selectedContentType === "tvshow" ? episode : undefined}
        />
      </div>
    </main>

    <Footer />
  </div>
</div>
