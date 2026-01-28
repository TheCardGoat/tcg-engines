<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type CardAspectRatio = "2.5/3.5" | "5/7" | "63/88" | string;

  interface CardProps {
    /** Whether the card is tapped/exhausted (90-degree rotation) */
    tapped?: boolean;
    /** Whether the card is face-down */
    faceDown?: boolean;
    /** Enable hover effects */
    hoverable?: boolean;
    /** Whether the card is selected */
    selected?: boolean;
    /** Whether the card is draggable */
    draggable?: boolean;
    /** Card aspect ratio */
    aspectRatio?: CardAspectRatio;
    /** Card ID for identification */
    id?: string;
    /** Additional CSS classes */
    class?: string;
    /** Card face content */
    children?: Snippet;
    /** Card back content (shown when faceDown) */
    cardBack?: Snippet;
    /** Click handler */
    onclick?: (event: MouseEvent) => void;
  }

  const {
    tapped = false,
    faceDown = false,
    hoverable = true,
    selected = false,
    draggable = true,
    aspectRatio = "2.5/3.5",
    id,
    class: className,
    children,
    cardBack,
    onclick,
  }: CardProps = $props();
</script>

<!--
  Card: Visual card component with states
  - Proper aspect ratio enforcement
  - Tapped/exhausted state (90-degree rotation)
  - Face-down state
  - Hover and selection effects
-->
<div
  class={cn(
    "card-component relative w-full h-full",
    "rounded-lg overflow-hidden",
    "transition-all duration-200 ease-in-out",
    "bg-base-100 border border-base-300",
    hoverable && "hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:z-10",
    selected && "ring-2 ring-primary ring-offset-2 ring-offset-base-100 z-20",
    tapped && "rotate-90 origin-center",
    draggable && "cursor-grab active:cursor-grabbing",
    className
  )}
  style:aspect-ratio={aspectRatio}
  role="button"
  tabindex="0"
  aria-label={faceDown ? "Face-down card" : "Card"}
  aria-pressed={selected}
  data-card-id={id}
  data-tapped={tapped}
  data-face-down={faceDown}
  {onclick}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onclick?.(e as unknown as MouseEvent);
    }
  }}
>
  {#if faceDown}
    {#if cardBack}
      {@render cardBack()}
    {:else}
      <!-- Default card back -->
      <div
        class={cn(
          "w-full h-full",
          "bg-gradient-to-br from-primary to-secondary",
          "flex items-center justify-center"
        )}
      >
        <div
          class="w-3/4 h-3/4 rounded-lg border-2 border-primary-content/30 bg-primary-content/10"
        ></div>
      </div>
    {/if}
  {:else if children}
    {@render children()}
  {:else}
    <!-- Default empty card face -->
    <div class="w-full h-full bg-base-200 flex items-center justify-center">
      <span class="text-base-content/50 text-xs">Card</span>
    </div>
  {/if}
</div>

<style>
  .card-component {
    /* Ensure tapped cards don't break layout */
    transform-origin: center center;
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    .card-component:hover {
      transform: none;
      box-shadow: none;
    }

    .card-component:active {
      transform: scale(0.95);
    }

    .card-component[data-tapped="true"]:active {
      transform: rotate(90deg) scale(0.95);
    }
  }
</style>
