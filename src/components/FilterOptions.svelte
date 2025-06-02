<script>
  export let language = 'en';
  export let source = 'all';
  export let hearingImpaired = null;
</script>

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
      id="hearing-impaired"
      class="p-2 rounded-md bg-mono-accent text-type-darker focus:outline-none shadow-md"
      bind:value={hearingImpaired}>
      <option value="true">Only show</option>
      <option value="false">Exclude</option>
      <option value="indifferent">Show both</option>
    </select>
  </div>
</div> 