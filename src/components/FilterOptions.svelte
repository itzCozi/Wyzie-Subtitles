<script>
  export let language = 'en';
  export let source = 'all';
  export let hearingImpaired = 'indifferent';
</script>

<div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
  <div class="flex flex-col gap-1 relative">
    <label
      for="language"
      class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Language:</label>
    <div class="relative">
      <select
        id="language"
        class="fuji-input appearance-none pr-8 w-fit min-w-[120px]"
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
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-type-secondary-light dark:text-type-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-1 relative">
    <label
      for="source"
      class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Source:</label>
    <div class="relative">
      <select
        id="source"
        class="fuji-input appearance-none pr-8"
        bind:value={source}>
        <option value="all">All Sources</option>
        <option value="opensubtitles">Open Subtitles</option>
        <option value="subdl">Sub DL</option>
        <option value="subf2m">SubF2M</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-type-secondary-light dark:text-type-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-1 relative">
    <label
      for="hearing-impaired"
      class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Hearing Impaired:</label>
    <div class="relative">
      <select
        id="hearing-impaired"
        class="fuji-input appearance-none pr-8"
        bind:value={hearingImpaired}>
        <option value="indifferent" selected>Show both</option>
        <option value="true">Only show</option>
        <option value="false">Exclude</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-type-secondary-light dark:text-type-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>
</div> 