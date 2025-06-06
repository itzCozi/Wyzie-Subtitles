<script>
  export let selectedContentType;
</script>

<div class="flex flex-col gap-2 whitespace-nowrap w-32">
  <label
    for="content-type"
    class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Media Type:</label>
  <div class="relative">
    <select
      id="content-type"
      class="fuji-input appearance-none pr-8 w-fit min-w-[120px]"
      bind:value={selectedContentType}>
      <option value="movie">Movie</option>
      <option value="tvshow">TV Show</option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-4 h-4 text-type-secondary-light dark:text-type-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</div>