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
  let directTmdbId = "";

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

  $: if (contentTitle) {
    searchTmdb();
  }

  async function searchByTmdbId() {
    if (!directTmdbId.trim()) return;
    
    isLoading = true;
    const searchType = selectedContentType === "movie" ? "movie" : "tv";
    const url = `https://api.themoviedb.org/3/${searchType}/${directTmdbId}?api_key=${tmdbApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.id) {
        contentTitle = data.title || data.name;
        selectedTmdbId = data.id;
        searchResults = [];
      }
    } catch (error) {
      console.error("Error searching TMDB by ID:", error);
    } finally {
      isLoading = false;
    }
  }

  $: if (directTmdbId) {
    searchByTmdbId();
  }

  function selectMedia(media) {
    contentTitle = media.title || media.name;
    selectedTmdbId = media.id;
    searchResults = [];
    isSearchFocused = false; // Close the dropdown when an item is selected
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

<div>
  <div class="flex flex-col min-h-screen">
    <header class="sticky top-0 z-10 bg-mono-secondary shadow-md py-4 px-5">
      <a
        href="https://sub.wyzie.ru"
        class="hover:no-underline"
        alt="Wyzie Subs API"
        title="Wyzie Subs API">
        <h1 class="text-4xl font-bold text-primary-700">
          Wyzie <span class="text-type-emphasized font-semibold">Subtitles</span>
        </h1>
      </a>
    </header>

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
          <div class="flex flex-col gap-2">
            <label
              for="content-type"
              class="text-sm text-type-secondary">Media Type:</label>
            <select
              id="content-type"
              class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md w-32"
              bind:value={selectedContentType}>
              <option value="movie">Movie</option>
              <option value="tvshow">TV Show</option>
            </select>
          </div>

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
                  directTmdbId = ""; // Clear TMDB ID when focusing on title search
                }}
                class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md flex-grow" />
              <input
                type="text"
                id="direct-tmdb-id"
                placeholder="TMDB ID"
                bind:value={directTmdbId}
                on:focus={() => {
                  isSearchFocused = false;
                  contentTitle = ""; // Clear title when focusing on TMDB ID
                  searchResults = [];
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
        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <label
              for="language"
              class="text-sm text-type-secondary">Language:</label>
            <select
              id="language"
              class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md"
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
          </div>
          <div class="flex flex-col gap-1">
            <label
              for="source"
              class="text-sm text-type-secondary">Source:</label>
            <select
              id="source"
              class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md"
              bind:value={source}>
              <option value="all">All Sources</option>
              <option value="opensubtitles">Open Subtitles</option>
              <option value="subdl">Sub DL</option>
              <option value="subf2m">SubF2M</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label
              for="hearing-impaired"
              class="text-sm text-type-secondary">Hearing Impaired:</label>
            <select
              id="source"
              class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md"
              bind:value={hearingImpaired}>
              <option value="true">Only show</option>
              <option value="false">Exclude</option>
              <option value="indifferent">Show both</option>
            </select>
          </div>
        </div>

        {#if selectedContentType === "tvshow"}
          <div class="flex justify-between items-center">
            <div class="flex flex-col gap-1">
              <label
                for="season"
                class="text-sm text-type-secondary">Season:</label>
              <input
                type="number"
                id="season"
                min="1"
                bind:value={season}
                class="p-2 rounded-md w-24 bg-mono-accent text-type-darker focus:outline-none shadow-md" />
            </div>
            <div class="flex flex-col gap-1">
              <label
                for="episode"
                class="text-sm text-type-secondary">Episode:</label>
              <input
                type="number"
                id="episode"
                min="1"
                bind:value={episode}
                class="p-2 rounded-md w-24 bg-mono-accent text-type-darker focus:outline-none shadow-md" />
            </div>
          </div>
        {/if}
        <button
          class="mt-2 inline-flex justify-center py-2 px-4 shadow-md text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          class:pointer-events-none={!selectedTmdbId}
          class:opacity-50={!selectedTmdbId}>
          Search {selectedContentType === "movie" ? "Movie" : "TV Show"}
        </button>
      </div>
    </main>

    <footer class="text-center text-type-footer text-sm mt-auto py-4">
      <p class="flex flex-row justify-center items-center gap-2">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://github.com/itzcozi"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:scale-105 text-dark transition duration-200"
          title="Github">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            class="w-5 h-5 fill-current">
            <path
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            ></path>
          </svg>
        </a>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://x.com/sudoflix"
          class="hover:scale-105 text-dark transition duration-200"
          title="Twitter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-5 h-5 fill-current">
            <path
              d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
            ></path>
          </svg>
        </a>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="mailto:dev@wyzie.ru"
          class="hover:scale-105 text-dark transition duration-200"
          title="Email">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 1920"
            class="w-5 h-5 fill-current">
            <path
              d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z"
              fill-rule="evenodd"></path>
          </svg>
        </a>
      </p>
      <p class="mt-2">
        Created by
        <a
          href="https://github.com/itzcozi"
          class="font-semibold transition duration-100"
          title="Developer Github link">BadDeveloper</a>
        with 💙
      </p>
    </footer>
  </div>
</div>
