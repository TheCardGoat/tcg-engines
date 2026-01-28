<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type ZoneType =
    | "hand"
    | "field"
    | "deck"
    | "graveyard"
    | "resource"
    | "exile"
    | "custom";
  type Orientation = "horizontal" | "vertical";
  type CardSpacing = "none" | "tight" | "normal" | "loose" | "overlap";

  interface ZoneProps {
    /** Type of zone for semantic styling */
    type?: ZoneType;
    /** Card arrangement direction */
    orientation?: Orientation;
    /** Spacing between cards */
    cardSpacing?: CardSpacing;
    /** Maximum number of cards (for visual hints) */
    maxCards?: number;
    /** Zone label for accessibility */
    label?: string;
    /** Whether this zone can receive dropped cards */
    droppable?: boolean;
    /** Visual highlight when a card can be dropped */
    dropHighlight?: boolean;
    /** Additional CSS classes */
    class?: string;
    /** Child content (cards, slots, etc.) */
    children?: Snippet;
  }

  const {
    type = "custom",
    orientation = "horizontal",
    cardSpacing = "normal",
    maxCards,
    label,
    droppable = false,
    dropHighlight = false,
    class: className,
    children,
  }: ZoneProps = $props();

  // Spacing classes based on orientation and spacing type
  const spacingClasses: Record<CardSpacing, Record<Orientation, string>> = {
    none: { horizontal: "gap-0", vertical: "gap-0" },
    tight: { horizontal: "gap-0.5", vertical: "gap-0.5" },
    normal: { horizontal: "gap-2", vertical: "gap-2" },
    loose: { horizontal: "gap-4", vertical: "gap-4" },
    overlap: { horizontal: "-space-x-8", vertical: "-space-y-8" },
  };

  // Zone type specific styling
  const zoneTypeClasses: Record<ZoneType, string> = {
    hand: "p-4 min-h-[120px] flex items-end justify-center perspective-1000",
    field:
      "p-4 min-h-[200px] rounded-xl bg-base-content/5 border-2 border-dashed border-base-content/10 backdrop-blur-sm shadow-inner",
    deck: "p-2 rounded-lg border-2 border-solid border-base-content/20 bg-base-200/30 shadow-sm",
    graveyard:
      "p-2 rounded-lg border-2 border-solid border-base-content/20 bg-black/20 shadow-inner",
    resource: "p-2 rounded-lg bg-primary/5 border border-primary/20",
    exile: "p-2 rounded-lg opacity-60 border border-base-content/10 grayscale",
    custom: "",
  };

  const orientationClasses: Record<Orientation, string> = {
    horizontal: "flex flex-row flex-wrap items-center",
    vertical: "flex flex-col items-center",
  };

  const ariaLabel = $derived(label ?? `${type} zone`);
</script>

<!--
  Zone: A flexible container for a board region
  - Supports different zone types (hand, field, deck, etc.)
  - Configurable orientation and card spacing
  - Drop target support for drag-and-drop
-->
<div
  class={cn(
    "zone relative",
    orientationClasses[orientation],
    cardSpacing === "overlap" 
      ? (orientation === "horizontal" ? "-space-x-8" : "-space-y-8")
      : spacingClasses[cardSpacing][orientation],
    zoneTypeClasses[type],
    dropHighlight && "ring-2 ring-primary ring-offset-2 ring-offset-base-100",
    droppable && "transition-shadow duration-200",
    className
  )}
  role="region"
  aria-label={ariaLabel}
  data-zone-type={type}
  data-droppable={droppable}
  data-max-cards={maxCards}
>
  {#if children}
    {@render children()}
  {/if}
</div>
