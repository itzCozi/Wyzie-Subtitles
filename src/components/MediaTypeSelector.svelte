<script>
  export let selectedContentType;
</script>

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