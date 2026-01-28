<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type AspectRatio = "16/9" | "3/2" | "4/3" | "9/16" | "2/3" | "3/4" | string;

  interface BoardSurfaceProps {
    /** Default aspect ratio for the board */
    aspectRatio?: AspectRatio;
    /** Aspect ratio override for portrait mobile devices */
    mobileAspectRatio?: AspectRatio;
    /** Aspect ratio override for desktop (min-width: 1024px landscape) */
    desktopAspectRatio?: AspectRatio;
    /** Maximum width constraint */
    maxWidth?: string;
    /** Board width as percentage of vmin */
    width?: string;
    /** Additional CSS classes */
    class?: string;
    /** Child content (zones, cards, etc.) */
    children: Snippet;
  }

  const {
    aspectRatio = "3/2",
    mobileAspectRatio,
    desktopAspectRatio,
    maxWidth = "1600px",
    width = "90vmin",
    class: className,
    children,
  }: BoardSurfaceProps = $props();

  // Generate unique ID for CSS custom properties scoping
  const surfaceId = $state(
    `board-surface-${Math.random().toString(36).slice(2, 9)}`,
  );
</script>

<!--
  BoardSurface: The "Picture" with fixed aspect ratio
  - Maintains strict aspect ratio regardless of viewport shape
  - Scales using vmin for guaranteed fit
  - Supports responsive aspect ratio switching
-->
<div
  class={cn(
    "board-surface relative box-border",
    className
  )}
  style:--board-aspect={aspectRatio}
  style:--board-mobile-aspect={mobileAspectRatio ?? aspectRatio}
  style:--board-desktop-aspect={desktopAspectRatio ?? aspectRatio}
  style:--board-max-width={maxWidth}
  style:--board-width={width}
  role="region"
  aria-label="Game board"
>
  {@render children()}
</div>

<style>
  .board-surface {
    aspect-ratio: var(--board-aspect, 3 / 2);
    width: var(--board-width, 90vmin);
    max-width: var(--board-max-width, 1600px);
  }

  /* Portrait mobile: switch to mobile aspect ratio */
  @media (max-width: 768px) and (orientation: portrait) {
    .board-surface {
      aspect-ratio: var(--board-mobile-aspect, var(--board-aspect, 9 / 16));
      width: 95vmin;
    }
  }

  /* Desktop landscape: switch to desktop aspect ratio */
  @media (min-width: 1024px) and (orientation: landscape) {
    .board-surface {
      aspect-ratio: var(--board-desktop-aspect, var(--board-aspect, 16 / 9));
    }
  }
</style>
