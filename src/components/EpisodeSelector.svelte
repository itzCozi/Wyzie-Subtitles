<script>
  export let season = 1;
  export let episode = 1;
</script>

<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div class="flex flex-col gap-1 w-full sm:w-auto">
    <label
      for="season"
      class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Season:</label>
    <input
      type="number"
      id="season"
      min="1"
      bind:value={season}
      class="fuji-input w-full sm:w-28" />
  </div>
  <div class="flex flex-col gap-1 w-full sm:w-auto">
    <label
      for="episode"
      class="text-sm text-type-secondary-light dark:text-type-secondary-dark">Episode:</label>
    <input
      type="number"
      id="episode"
      min="1"
      bind:value={episode}
      class="fuji-input w-full sm:w-28" />
  </div>
</div> 