<script lang="ts">
  import DebugJsonTree from "./DebugJsonTree.svelte";

  let { value, label = "JSON", expanded = true }: {
    value: unknown;
    label?: string;
    expanded?: boolean;
  } = $props();

  const isContainer = $derived(value !== null && typeof value === "object");
  const entries = $derived(
    value !== null && typeof value === "object" ? Object.entries(value) : [],
  );
</script>

{#if isContainer}
  <details open={expanded}>
    <summary>{label}: {Array.isArray(value) ? "Array" : "Object"} ({entries.length})</summary>
    <ul>
      {#each entries as [key, entry] (key)}
        <li><DebugJsonTree value={entry} label={key} expanded={false} /></li>
      {/each}
    </ul>
  </details>
{:else}
  <code>{label}: {JSON.stringify(value) ?? String(value)}</code>
{/if}

<style>
  details, code { font-family: monospace; font-size: 0.75rem; overflow-wrap: anywhere; }
  summary { cursor: pointer; }
  ul { margin: 0; padding-left: 1rem; list-style: none; }
  li { padding-top: 0.2rem; }
</style>
