<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let selectedContentType = "tvshow";
  let season = 1;
  let episode = 1;
  let imdbId = "";
  let language = "en";
  let source = "all";
  let hearingImpaired = null;
  let contentTitle = "";
  let searchResults = [];
  let isLoading = false;
  let selectedTmdbId = null;
  let tmdbApiKey = "9867f3f6a5e78a2639afb0e2ffc0a311";
  let isSearchFocused = false;

  // Added variables for trending content
  let trendingMovies = [];
  let trendingShows = [];
  let isTrendingMoviesLoading = false;
  let isTrendingShowsLoading = false;

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  // Search for movies or TV shows as user types
  const searchTmdb = debounce(async () => {
    if (contentTitle.trim().length < 2) {
      searchResults = [];
      return;
    }

    isLoading = true;
    const searchType = selectedContentType === "movie" ? "movie" : "tv";
    const url = `https://api.themoviedb.org/3/search/${searchType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(contentTitle)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      searchResults = data.results.slice(0, 3);
    } catch (error) {
      console.error("Error searching TMDB:", error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  });

  // Fetch trending movies from TMDB
  async function fetchTrendingMovies() {
    isTrendingMoviesLoading = true;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}`,
      );
      const data = await response.json();
      trendingMovies = data.results.slice(0, 6); // Get first 6 results
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      trendingMovies = [];
    } finally {
      isTrendingMoviesLoading = false;
    }
  }

  // Fetch trending TV shows from TMDB
  async function fetchTrendingShows() {
    isTrendingShowsLoading = true;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}`,
      );
      const data = await response.json();
      trendingShows = data.results.slice(0, 6); // Get first 6 results
    } catch (error) {
      console.error("Error fetching trending shows:", error);
      trendingShows = [];
    } finally {
      isTrendingShowsLoading = false;
    }
  }

  $: if (contentTitle) {
    searchTmdb();
  }

  function selectMedia(media) {
    contentTitle = media.title || media.name;
    selectedTmdbId = media.id;
    searchResults = [];
    isSearchFocused = false; // Close the dropdown when an item is selected
  }

  // Function to open search for trending content
  function selectTrendingItem(item) {
    contentTitle = item.title || item.name;
    selectedTmdbId = item.id;
    selectedContentType = item.title ? "movie" : "tvshow";
  }

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

      // Fetch trending content on page load
      fetchTrendingMovies();
      fetchTrendingShows();
    }
  });

  onDestroy(() => {
    if (browser) {
      // Only remove event listener if in browser
      document.removeEventListener("click", handleClickOutside);
    }
  });

  $: searchUrl =
    selectedContentType === "movie" ?
      `/search?id=${imdbId}&tmdb=${selectedTmdbId}`
    : `/search?id=${imdbId}&tmdb=${selectedTmdbId}&season=${season}&episode=${episode}&language=${language}`;
</script>

<div class="bg-mono-background min-h-screen">
  <!-- Hero section with background image -->
  <div class="relative bg-gradient-to-b from-primary-50 to-mono-background">
    <header class="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm py-4 px-5">
      <div class="container mx-auto flex justify-between items-center">
        <a
          href="/"
          class="flex items-center"
          title="Wyzie Subtitles">
          <span class="text-3xl font-bold text-primary-700">
            Wyzie <span class="text-type-emphasized font-semibold">Subtitles</span>
          </span>
        </a>
        <a
          href="https://sub.wyzie.ru"
          class="text-sm text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
          title="Wyzie Subs API">
          API Documentation
        </a>
      </div>
    </header>

        <main class="container mx-auto px-4 py-8 md:py-12">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-3xl md:text-5xl font-bold text-type-emphasized mb-4 md:mb-6 leading-tight">
          Find Perfect Subtitles <span class="text-primary-600">Instantly</span>
        </h1>
        <p class="text-type-dimmed text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Search and download free subtitles for your favorite movies and TV shows. Simple, fast,
          and completely free.
        </p>
      </div>

      <div
              class="bg-mono-secondary rounded-xl shadow-md max-w-xl mx-auto overflow-hidden border border-mono-accent mt-6 md:mt-8">
              <div class="px-4 py-5 md:p-6">
                <!-- Main search field with enhanced styling -->
                <div class="relative mb-5 md:mb-6">
                  <div
                    class="flex items-center border-2 rounded-lg border-primary-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all py-2 px-3">
                    <div class="flex-shrink-0 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-primary-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="content-title"
                      placeholder={`Search for ${selectedContentType === "movie" ? "a movie" : "a TV show"} title...`}
                      bind:value={contentTitle}
                      on:focus={() => (isSearchFocused = true)}
                      class="w-full py-1 bg-transparent text-type-emphasized text-base md:text-lg focus:outline-none placeholder:text-type-secondary" />
                    {#if isLoading}
                      <div class="w-5 h-5 ml-1">
                        <div
                          class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin">
                        </div>
                      </div>
                    {/if}
                  </div>

                  <!-- Search results dropdown with enhanced styling -->
                  {#if searchResults.length > 0 && isSearchFocused}
                    <div
                      id="search-results"
                      class="absolute top-full left-0 right-0 bg-mono-secondary mt-1 rounded-lg shadow-xl z-10 overflow-hidden max-h-[60vh] overflow-y-auto">
                      {#each searchResults as result}
                        <button
                          class="w-full text-left p-3 hover:bg-mono-accent flex items-center gap-4 transition duration-200"
                          on:click={() => selectMedia(result)}>
                          {#if result.poster_path}
                            <img
                              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                              alt={result.title || result.name}
                              class="w-16 h-24 object-cover rounded shadow-sm" />
                          {/if}
                          <div>
                            <p class="text-type-emphasized font-medium text-lg">
                              {result.title || result.name}
                            </p>
                            <p class="text-sm text-type-secondary">
                              {result.release_date?.substring(0, 4) ||
                                result.first_air_date?.substring(0, 4) ||
                                "Unknown year"}
                            </p>
                            <p class="text-xs text-type-footer mt-1 line-clamp-2">
                              {result.overview || "No description available"}
                            </p>
                          </div>
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>

                <!-- Form options with improved responsive layout using flexbox -->
                <div class="flex flex-col md:grid md:grid-cols-2 gap-6">
                  <!-- Left column -->
                  <div class="flex flex-col space-y-6">
                    <!-- Media Type -->
                    <div>
                      <label class="block text-type-secondary text-sm font-medium mb-2">Media Type</label>
                      <div class="flex rounded-lg overflow-hidden shadow-sm">
                        <button
                          class="flex-1 py-2.5 px-4 transition-colors"
                          class:bg-primary-600={selectedContentType === "movie"}
                          class:text-white={selectedContentType === "movie"}
                          class:bg-mono-accent={selectedContentType !== "movie"}
                          class:text-type-dimmed={selectedContentType !== "movie"}
                          on:click={() => (selectedContentType = "movie")}>
                          <span class="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                              ></path>
                            </svg>
                            Movie
                          </span>
                        </button>
                        <button
                          class="flex-1 py-2.5 px-4 transition-colors"
                          class:bg-primary-600={selectedContentType === "tvshow"}
                          class:text-white={selectedContentType === "tvshow"}
                          class:bg-mono-accent={selectedContentType !== "tvshow"}
                          class:text-type-dimmed={selectedContentType !== "tvshow"}
                          on:click={() => (selectedContentType = "tvshow")}>
                          <span class="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              ></path>
                            </svg>
                            TV Show
                          </span>
                        </button>
                      </div>
                    </div>

                    <!-- Language -->
                    <div>
                      <label
                        for="language"
                        class="block text-type-secondary text-sm font-medium mb-2">Language</label>
                      <div class="relative">
                        <select
                          id="language"
                          class="p-2.5 rounded-lg bg-mono-accent text-type-darker focus:outline-none focus:ring-2 focus:ring-primary-100 shadow-sm w-full appearance-none pr-10"
                          bind:value={language}>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                          <option value="pt">Portuguese</option>
                          <option value="ru">Russian</option>
                          <option value="ja">Japanese</option>
                          <option value="zh">Chinese</option>
                          <option value="ar">Arabic</option>
                        </select>
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-type-secondary">
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right column -->
                  <div class="flex flex-col space-y-6">
                    <!-- Hearing Impaired -->
                    <div>
                      <label
                        for="hearing-impaired"
                        class="block text-type-secondary text-sm font-medium mb-2"
                        >Hearing Impaired</label>
                      <div class="relative">
                        <select
                          id="hearing-impaired"
                          class="p-2.5 rounded-lg bg-mono-accent text-type-darker focus:outline-none focus:ring-2 focus:ring-primary-100 shadow-sm w-full appearance-none pr-10"
                          bind:value={hearingImpaired}>
                          <option value="true">Only show</option>
                          <option value="false">Exclude</option>
                          <option value="indifferent">Show both</option>
                        </select>
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-type-secondary">
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- TV Show specific fields -->
                    {#if selectedContentType === "tvshow"}
                      <div class="flex flex-row space-x-4">
                        <div class="flex-1">
                          <label
                            for="season"
                            class="block text-type-secondary text-sm font-medium mb-2">Season</label>
                          <input
                            type="number"
                            id="season"
                            min="1"
                            bind:value={season}
                            class="p-2.5 rounded-lg w-full bg-mono-accent text-type-darker focus:outline-none focus:ring-2 focus:ring-primary-100 shadow-sm" />
                        </div>
                        <div class="flex-1">
                          <label
                            for="episode"
                            class="block text-type-secondary text-sm font-medium mb-2">Episode</label>
                          <input
                            type="number"
                            id="episode"
                            min="1"
                            bind:value={episode}
                            class="p-2.5 rounded-lg w-full bg-mono-accent text-type-darker focus:outline-none focus:ring-2 focus:ring-primary-100 shadow-sm" />
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Source field - full width across columns -->
                <div class="mt-5">
                  <label
                    for="source"
                    class="block text-type-secondary text-sm font-medium mb-2">Source</label>
                  <div class="relative">
                    <select
                      id="source"
                      class="p-2.5 rounded-lg bg-mono-accent text-type-darker focus:outline-none focus:ring-2 focus:ring-primary-100 shadow-sm w-full appearance-none pr-10"
                      bind:value={source}>
                      <option value="all">All Sources</option>
                      <option value="opensubtitles">OpenSubtitles</option>
                      <option value="subdl">SubDL</option>
                      <option value="subf2m">SubF2M</option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-type-secondary">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Search button with improved styling -->
              <div class="px-4 pb-6 md:px-6 md:pb-8 mt-5">
                <a
                  href={searchUrl}
                  class="w-full inline-flex justify-center items-center py-3 shadow-md text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  class:pointer-events-none={!selectedTmdbId}
                  class:opacity-50={!selectedTmdbId}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Find Subtitles
                </a>
              </div>
</div>
            </div>

  <div class="max-w-6xl mx-auto mt-20 px-4">
    <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
      <div
        class="bg-white rounded-lg shadow-md p-6 border border-mono-accent transition-all hover:shadow-lg hover:translate-y-[-2px]">
        <div
          class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-type-subheader mb-3">Fast & Free</h4>
        <p class="text-type-dimmed">
          Download subtitles instantly without any fees or limitations. Perfect for your media
          library.
        </p>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 border border-mono-accent transition-all hover:shadow-lg hover:translate-y-[-2px]">
        <div
          class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-type-subheader mb-3">Multiple Sources</h4>
        <p class="text-type-dimmed">
          Access subtitles from various sources to ensure you find the perfect match for any
          content.
        </p>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-6 border border-mono-accent transition-all hover:shadow-lg hover:translate-y-[-2px]">
        <div
          class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            ></path>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-type-subheader mb-3">Multiple Languages</h4>
        <p class="text-type-dimmed">
          Find subtitles in various languages for your international viewing needs and language
          learning.
        </p>
      </div>
    </div>
  </div>

  <!-- Trending Movies Section -->
  <div class="max-w-6xl mx-auto mt-16 px-4 py-6">
      <h3 class="text-2xl font-bold text-type-emphasized mb-6">Trending Movies This Week</h3>


    {#if isTrendingMoviesLoading}
      <div class="flex justify-center my-12">
        <div
          class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin">
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {#each trendingMovies as movie}
          <div
            class="group cursor-pointer"
            on:click={() => selectTrendingItem(movie)}>
            <div
              class="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-4px]">
              {#if movie.poster_path}
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  class="w-full aspect-[2/3] object-cover"
                  loading="lazy" />
              {:else}
                <div
                  class="w-full aspect-[2/3] bg-mono-accent flex items-center justify-center text-center p-4 text-type-secondary">
                  No Image Available
                </div>
              {/if}

              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div class="p-3 w-full">
                  <p class="text-white font-medium text-center">{movie.title}</p>
                </div>
              </div>

              <!-- Rating badge -->
              <div
                class="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {Math.round(movie.vote_average * 10) / 10}
              </div>
            </div>
            <h4 class="mt-2 text-type-emphasized font-medium text-sm line-clamp-1">
              {movie.title}
            </h4>
            <p class="text-xs text-type-secondary">
              {movie.release_date?.substring(0, 4) || "Unknown"}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Trending TV Shows Section -->
  <div class="max-w-6xl mx-auto mt-16 px-4 py-6">
      <h3 class="text-2xl font-bold text-type-emphasized mb-6">Trending TV Shows This Week</h3>


    {#if isTrendingShowsLoading}
      <div class="flex justify-center my-12">
        <div
          class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin">
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {#each trendingShows as show}
          <div
            class="group cursor-pointer"
            on:click={() => selectTrendingItem(show)}>
            <div
              class="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-4px]">
              {#if show.poster_path}
                <img
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.name}
                  class="w-full aspect-[2/3] object-cover"
                  loading="lazy" />
              {:else}
                <div
                  class="w-full aspect-[2/3] bg-mono-accent flex items-center justify-center text-center p-4 text-type-secondary">
                  No Image Available
                </div>
              {/if}

              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div class="p-3 w-full">
                  <p class="text-white font-medium text-center">{show.name}</p>
                </div>
              </div>

              <!-- Rating badge -->
              <div
                class="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {Math.round(show.vote_average * 10) / 10}
              </div>
            </div>
            <h4 class="mt-2 text-type-emphasized font-medium text-sm line-clamp-1">{show.name}</h4>
            <p class="text-xs text-type-secondary">
              {show.first_air_date?.substring(0, 4) || "Unknown"}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Updated footer -->
  <footer class="bg-white border-t border-gray-100 mt-16 py-12 px-4">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-8 md:mb-0">
          <h2 class="text-xl font-semibold text-primary-700 mb-1">
            Wyzie <span class="text-type-emphasized">Subtitles</span>
          </h2>
          <p class="text-sm text-type-footer mt-1">
            The easiest way to find subtitles for any media.
          </p>
        </div>
        <div class="flex space-x-6 mb-8 md:mb-0">
          <a
            href="https://github.com/itzcozi"
            class="text-type-footer hover:text-primary-600 transition-colors"
            title="GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              class="h-6 w-6 fill-current">
              <path
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              ></path>
            </svg>
          </a>
          <a
            href="https://x.com/sudoflix"
            class="text-type-footer hover:text-primary-600 transition-colors"
            title="Twitter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-6 w-6 fill-current">
              <path
                d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
              ></path>
            </svg>
          </a>
          <a
            href="mailto:dev@wyzie.ru"
            class="text-type-footer hover:text-primary-600 transition-colors"
            title="Email">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1920 1920"
              class="h-6 w-6 fill-current">
              <path
                d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z"
                fill-rule="evenodd"></path>
            </svg>
          </a>
        </div>
      </div>

      <div class="text-center mt-6 pt-6 border-t border-gray-100">
        <p class="text-type-footer text-sm mb-2">
          Created by <a
            href="https://github.com/itzcozi"
            class="font-semibold transition-colors hover:text-primary-600">BadDeveloper</a> with 💙
        </p>
        <p class="text-type-footer text-xs">© {new Date().getFullYear()} Wyzie Subtitles</p>
      </div>
    </div>
  </footer>
</div>
