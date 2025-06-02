<script>
  export let season = 1;
  export let episode = 1;
</script>

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