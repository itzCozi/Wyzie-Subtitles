<script>
  import { onMount } from 'svelte';
  
  let isDarkMode = false;
  
  onMount(() => {
    // Check for saved theme preference or user OS preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      isDarkMode = true;
    } else {
      document.documentElement.classList.add('light');
      isDarkMode = false;
    }
  });
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<header class="sticky top-0 z-10 bg-mono-secondary-light dark:bg-mono-secondary-dark shadow-fuji dark:shadow-fuji-dark py-4 px-5 transition-all duration-300">
  <div class="max-w-6xl mx-auto flex justify-between items-center">
    <a
      href="https://sub.wyzie.ru"
      class="hover:no-underline flex items-center"
      alt="Wyzie Subs API"
      title="Wyzie Subs API">
      <h1 class="text-3xl font-bold text-primary-600">
        Wyzie <span class="text-type-emphasized-light dark:text-type-emphasized-dark font-semibold">Subtitles</span>
      </h1>
    </a>
    
    <div class="flex items-center">
      <button 
        type="button"
        class="p-2 rounded-full hover:bg-mono-accent-light dark:hover:bg-mono-accent-dark transition-colors duration-200"
        on:click={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {#if isDarkMode}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-type-secondary-light dark:text-type-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-type-secondary-light dark:text-type-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</header> 