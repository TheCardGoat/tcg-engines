<script lang="ts">
  import { CARD_BACK_PRESETS } from "@/features/simulator/model/player-visual-settings.js";

  interface CardSleevePickerProps {
    selectedCardBack?: string;
    onSelect: (presetId: string) => void;
  }

  let { selectedCardBack = "default", onSelect }: CardSleevePickerProps = $props();

  const presetEntries = Object.entries(CARD_BACK_PRESETS) as [
    string,
    { src: string; artOnlySrc: string } | null,
  ][];
</script>

<div class="sleeve-picker-grid">
  {#each presetEntries as [id, preset]}
    <button
      type="button"
      class="sleeve-picker-item"
      class:selected={selectedCardBack === id}
      onclick={() => onSelect(id)}
      aria-label="Select card sleeve: {id}"
      aria-pressed={selectedCardBack === id}
    >
      {#if preset}
        <img
          class="sleeve-picker-thumb"
          src={preset.src}
          alt={id}
          loading="lazy"
          draggable="false"
        />
      {:else}
        <div class="sleeve-picker-none">
          <span>None</span>
        </div>
      {/if}
    </button>
  {/each}
</div>

<style>
  .sleeve-picker-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .sleeve-picker-item {
    position: relative;
    aspect-ratio: 63 / 88;
    border-radius: 0.5rem;
    border: 2px solid transparent;
    overflow: hidden;
    cursor: pointer;
    background: rgba(14, 25, 40, 0.92);
    transition: border-color 0.15s ease;
  }

  .sleeve-picker-item:hover {
    border-color: rgba(147, 197, 253, 0.5);
  }

  .sleeve-picker-item:focus-visible {
    outline: 2px solid rgba(147, 197, 253, 0.5);
    outline-offset: 1px;
  }

  .sleeve-picker-item.selected {
    border-color: rgba(250, 204, 21, 0.85);
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.3);
  }

  .sleeve-picker-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sleeve-picker-none {
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
