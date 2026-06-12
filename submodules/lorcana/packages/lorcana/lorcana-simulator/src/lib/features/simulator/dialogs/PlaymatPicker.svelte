<script lang="ts">
  import { PLAYMAT_PRESETS } from "@/features/simulator/model/player-visual-settings.js";

  interface PlaymatPickerProps {
    selectedPlaymat?: string;
    onSelect: (presetId: string) => void;
  }

  let { selectedPlaymat = "default", onSelect }: PlaymatPickerProps = $props();

  const presetEntries = Object.entries(PLAYMAT_PRESETS) as [string, string | null][];
</script>

<div class="playmat-picker-grid">
  {#each presetEntries as [id, src]}
    <button
      type="button"
      class="playmat-picker-item"
      class:selected={selectedPlaymat === id}
      onclick={() => onSelect(id)}
      aria-label="Select playmat: {id}"
      aria-pressed={selectedPlaymat === id}
    >
      {#if src}
        <img
          class="playmat-picker-thumb"
          src={src}
          alt={id}
          loading="lazy"
          draggable="false"
        />
      {:else}
        <div class="playmat-picker-none">
          <span>None</span>
        </div>
      {/if}
    </button>
  {/each}
</div>

<style>
  .playmat-picker-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .playmat-picker-item {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    border: 2px solid transparent;
    overflow: hidden;
    cursor: pointer;
    background: rgba(14, 25, 40, 0.92);
    transition: border-color 0.15s ease;
  }

  .playmat-picker-item:hover {
    border-color: rgba(147, 197, 253, 0.5);
  }

  .playmat-picker-item:focus-visible {
    outline: 2px solid rgba(147, 197, 253, 0.5);
    outline-offset: 1px;
  }

  .playmat-picker-item.selected {
    border-color: rgba(250, 204, 21, 0.85);
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.3);
  }

  .playmat-picker-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .playmat-picker-none {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: #9fb2c9;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
</style>
