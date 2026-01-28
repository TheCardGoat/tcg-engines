<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type AspectRatio = `${number}/${number}`;

  function parseAspectRatio(aspectRatio: string): { w: number; h: number } {
    const [wRaw, hRaw] = aspectRatio.split("/");
    const w = Number(wRaw);
    const h = Number(hRaw);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      return { w: 3, h: 2 };
    }

    return { w, h };
  }

  interface BoardSurfaceProps {
    /** Default aspect ratio for the board */
    aspectRatio?: AspectRatio;
    /** Aspect ratio override for portrait mobile devices */
    mobileAspectRatio?: AspectRatio;
    /** Aspect ratio override for desktop (min-width: 1024px landscape) */
    desktopAspectRatio?: AspectRatio;
    /** Maximum width constraint */
    maxWidth?: string;
    /** Board width override (any CSS length) */
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
    width,
    class: className,
    children,
  }: BoardSurfaceProps = $props();

  const baseRatio = $derived(parseAspectRatio(aspectRatio));
  const mobileRatio = $derived(
    parseAspectRatio(mobileAspectRatio ?? aspectRatio),
  );
  const desktopRatio = $derived(
    parseAspectRatio(desktopAspectRatio ?? aspectRatio),
  );
</script>

<!--
  BoardSurface: The "Picture" with fixed aspect ratio
  - Maintains strict aspect ratio regardless of viewport shape
  - Scales to fit within the viewport
  - Supports responsive aspect ratio switching
-->
<div
  class={cn(
    "board-surface relative box-border",
    "bg-base-300 shadow-2xl overflow-hidden",
    className
  )}
  style:--board-aspect={aspectRatio}
  style:--board-mobile-aspect={mobileAspectRatio ?? aspectRatio}
  style:--board-desktop-aspect={desktopAspectRatio ?? aspectRatio}
  style:--board-aspect-w={baseRatio.w}
  style:--board-aspect-h={baseRatio.h}
  style:--board-mobile-aspect-w={mobileRatio.w}
  style:--board-mobile-aspect-h={mobileRatio.h}
  style:--board-desktop-aspect-w={desktopRatio.w}
  style:--board-desktop-aspect-h={desktopRatio.h}
  style:--board-max-width={maxWidth}
  style:--board-width={width}
  role="region"
  aria-label="Game board"
>
  <!-- Tabletop Texture/Background -->
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-base-100)_0%,_var(--color-base-300)_100%)] opacity-50 pointer-events-none"
  ></div>
  <div
    class="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] pointer-events-none"
  ></div>

  {@render children()}
</div>

<style>
  .board-surface {
    aspect-ratio: var(--board-aspect, 3 / 2);
    width: var(
      --board-width,
      min(
        var(--board-max-width, 1600px),
        calc(100vw * 0.9),
        calc(100vh * 0.9 * var(--board-aspect-w, 3) / var(--board-aspect-h, 2))
      )
    );
    max-width: var(--board-max-width, 1600px);
  }

  /* Portrait mobile: switch to mobile aspect ratio */
  @media (max-width: 768px) and (orientation: portrait) {
    .board-surface {
      aspect-ratio: var(--board-mobile-aspect, var(--board-aspect, 9 / 16));
      width: var(
        --board-width,
        min(
          var(--board-max-width, 1600px),
          calc(100vw * 0.95),
          calc(
            100vh *
            0.95 *
            var(--board-mobile-aspect-w, 9) /
            var(--board-mobile-aspect-h, 16)
          )
        )
      );
    }
  }

  /* Desktop landscape: switch to desktop aspect ratio */
  @media (min-width: 1024px) and (orientation: landscape) {
    .board-surface {
      aspect-ratio: var(--board-desktop-aspect, var(--board-aspect, 16 / 9));
      width: var(
        --board-width,
        min(
          var(--board-max-width, 1600px),
          calc(100vw * 0.9),
          calc(
            100vh *
            0.9 *
            var(--board-desktop-aspect-w, 16) /
            var(--board-desktop-aspect-h, 9)
          )
        )
      );
    }
  }
</style>
