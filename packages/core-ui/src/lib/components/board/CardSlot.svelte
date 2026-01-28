<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type CardAspectRatio = "2.5/3.5" | "5/7" | "63/88" | string;

  interface CardSlotProps {
    /** Aspect ratio of the card slot (default: standard TCG 2.5:3.5) */
    cardAspectRatio?: CardAspectRatio;
    /** Whether the slot is empty (shows placeholder) */
    empty?: boolean;
    /** Visual highlight for valid drop targets */
    highlighted?: boolean;
    /** Whether this slot can receive dropped cards */
    droppable?: boolean;
    /** Slot index for identification */
    index?: number;
    /** Additional CSS classes */
    class?: string;
    /** Child content (typically a Card component) */
    children?: Snippet;
    /** Custom empty state content */
    emptySlot?: Snippet;
  }

  const {
    cardAspectRatio = "2.5/3.5",
    empty = false,
    highlighted = false,
    droppable = true,
    index,
    class: className,
    children,
    emptySlot,
  }: CardSlotProps = $props();
</script>

<!--
  CardSlot: Individual card placement area
  - Maintains card aspect ratio
  - Handles empty/occupied states
  - Drop target for drag-and-drop
-->
<div
  class={cn(
    "card-slot relative flex items-center justify-center",
    "transition-all duration-200 ease-in-out",
    highlighted && "ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105",
    droppable && !empty && "cursor-pointer",
    className
  )}
  style:aspect-ratio={cardAspectRatio}
  role="listitem"
  aria-label={empty ? `Empty card slot${index !== undefined ? ` ${index + 1}` : ""}` : `Card slot${index !== undefined ? ` ${index + 1}` : ""}`}
  data-slot-index={index}
  data-droppable={droppable}
  data-empty={empty}
>
  {#if empty}
    {#if emptySlot}
      {@render emptySlot()}
    {:else}
      <!-- Default empty slot placeholder -->
      <div
        class={cn(
          "w-full h-full rounded-lg border-2 border-dashed",
          "border-base-content/20 bg-base-200/30",
          "flex items-center justify-center"
        )}
      >
        <span class="text-base-content/30 text-xs">Empty</span>
      </div>
    {/if}
  {:else if children}
    {@render children()}
  {/if}
</div>
