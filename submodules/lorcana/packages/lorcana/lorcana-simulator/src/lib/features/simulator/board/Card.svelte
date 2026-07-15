<script lang="ts">
  /**
   * @deprecated Use LorcanaCard.svelte instead. This component is kept for backward compatibility.
   *
   * Migration guide:
   * - Import `LorcanaCard` from `@/design-system/simulator/cards/LorcanaCard.svelte` instead
   * - The `isMasked` prop replaces the need for CardBack
   * - All other props remain the same
   * - Note: `inkColor` prop is deprecated and no longer used (card images show ink colors)
   */
  import type { LorcanaCardSnapshot } from "$lib/lorcana-simulator";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";

  type InkColor = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel" | null;
  type ImageFormat = "full" | "art_only" | "art_and_name";

  interface CardProps {
    card: LorcanaCardSnapshot;
    size?: "micro" | "tiny" | "small" | "small-plus" | "medium" | "large" | "x-large";
    imageFormat?: ImageFormat;
    isSelected?: boolean;
    isExerted?: boolean;
    isMasked?: boolean;
    isGhost?: boolean;
    isDraggable?: boolean;
    isPlayable?: boolean;
    isValidTarget?: boolean;
    isInvalidTarget?: boolean;
    isQuesting?: boolean;
    isDrying?: boolean;
    /** @deprecated No longer used - card images show ink colors automatically */
    inkColor?: InkColor;
    damage?: number;
      onDragStart?: (event: DragEvent) => void;
  }

  let {
    card,
    size = "medium",
    imageFormat = "full",
    isSelected = false,
    isExerted = false,
    isMasked = false,
    isGhost = false,
    isDraggable = false,
    isPlayable = false,
    isValidTarget = false,
    isInvalidTarget = false,
    isQuesting = false,
    isDrying = false,
    inkColor: _inkColor = null, // eslint-disable-line @typescript-eslint/no-unused-vars
    damage = 0,
    onDragStart,
  }: CardProps = $props();
</script>

<LorcanaCard
  {card}
  {size}
  {imageFormat}
  {isSelected}
  {isExerted}
  {isMasked}
  {isGhost}
  {isDraggable}
  {isPlayable}
  {isValidTarget}
  {isInvalidTarget}
  {isQuesting}
  {isDrying}
  {damage}
  onDragStart={onDragStart}
/>
