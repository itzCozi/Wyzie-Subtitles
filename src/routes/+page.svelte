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

    <main class="flex-grow mt-8 mx-auto px-6">
      <div class="bg-mono-secondary shadow-lg p-7 rounded-md flex flex-col gap-4 max-w-xl mx-auto">
        <span>
          <h3 class="font-semibold text-type-subheader text-2xl mb-1">Subtitles for Free</h3>
          <p class="text-type-dimmed text-sm">
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
          class="mt-2 inline-flex justify-center py-2 px-4 shadow-md text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          class:pointer-events-none={!selectedTmdbId}
          class:opacity-50={!selectedTmdbId}
          on:click={() => subtitleResultsComponent?.search()}>
          Search {selectedContentType === "movie" ? "Movie" : "TV Show"}
        </button>

        {#if selectedTmdbId}
          <SubtitleResults
            bind:this={subtitleResultsComponent}
            tmdbId={selectedTmdbId}
            imdbId={imdbId}
            {season}
            {episode}
            {language}
            {source}
            {hearingImpaired}
          />
        {/if}
      </div>
    </main>

    <Footer />
  </div>
</div>
