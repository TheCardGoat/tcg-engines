<script lang="ts">
  import CardBack from "./CardBack.svelte";
  import ZoneCounter from "../display/ZoneCounter.svelte";

  const ART_ONLY_ASPECT_RATIO = 734 / 602;

  interface DeckStackProps {
    count?: number;
    showCount?: boolean;
    ownerId?: string | null;
    seat?: "top" | "bottom";
  }

  let { count, showCount = true, ownerId = null, seat = "top" }: DeckStackProps = $props();

</script>

<div
  class="relative flex items-center justify-center deck-stack"
  style="width: var(--zone-card-width, 40px); height: var(--zone-card-height, 56px);"
>
  <div class="deck-card absolute inset-0">
    <CardBack
      {ownerId}
      displayWidth={49}
      displayHeight={40}
      aspectRatio={ART_ONLY_ASPECT_RATIO}
      useContainerSize={true}
      imageFormat="art_only"
    />
  </div>
  <div class="deck-card absolute inset-0">
    <CardBack
      {ownerId}
      displayWidth={49}
      displayHeight={40}
      aspectRatio={ART_ONLY_ASPECT_RATIO}
      useContainerSize={true}
      imageFormat="art_only"
    />
  </div>
  <div class="deck-card absolute inset-0">
    <CardBack
      {ownerId}
      displayWidth={49}
      displayHeight={40}
      aspectRatio={ART_ONLY_ASPECT_RATIO}
      useContainerSize={true}
      imageFormat="art_only"
    />
  </div>
  {#if showCount && count !== undefined}
    <ZoneCounter count={count} corner={seat === "bottom" ? "bottom-right" : "top-right"} />
  {/if}
  {#if !showCount && count !== undefined}
    <span class="deck-inline-count">{count}</span>
  {/if}
</div>

<style>
  /* nth-child selectors for stacked card effect - no Tailwind equivalent */
  .deck-card:nth-child(1) {
    transform: translate(-4px, 4px);
  }

  .deck-card:nth-child(2) {
    transform: translate(-2px, 2px);
  }

  .deck-card:nth-child(3) {
    transform: translate(0, 0);
  }

  .deck-stack:hover .deck-card:nth-child(1) {
    transform: translate(-5px, 5px);
  }

  .deck-stack:hover .deck-card:nth-child(2) {
    transform: translate(-1px, 1px) rotate(-2deg);
  }

  .deck-stack:hover .deck-card:nth-child(3) {
    transform: translate(3px, -3px) rotate(-4deg);
  }

  /* Inline deck count (counters OFF, hover only) */
  .deck-inline-count {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    color: #e2e8f0;
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 999px;
    padding: 0 6px;
    pointer-events: none;
    z-index: 5;
    line-height: 1;
    user-select: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .deck-stack:hover .deck-inline-count {
    opacity: 1;
  }
</style>
