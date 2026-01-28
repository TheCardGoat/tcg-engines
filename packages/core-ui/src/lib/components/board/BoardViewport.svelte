<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utils.js";

  type OverflowStrategy = "hidden" | "auto" | "scroll";

  interface BoardViewportProps extends HTMLAttributes<HTMLDivElement> {
    /** Background color/gradient for the empty space (letterbox/pillarbox) */
    background?: string;
    /** How to handle overflow when board exceeds viewport */
    overflow?: OverflowStrategy;
    /** Additional CSS classes */
    class?: string;
    /** Child content (typically BoardSurface) */
    children: Snippet;
  }

  const {
    background,
    overflow = "hidden",
    class: className,
    children,
    ...rest
  }: BoardViewportProps = $props();

  const overflowClasses: Record<OverflowStrategy, string> = {
    hidden: "overflow-hidden",
    auto: "overflow-auto",
    scroll: "overflow-scroll",
  };
</script>

<!--
  BoardViewport: The "Frame" container
  - Fills the entire viewport (100vw x 100vh)
  - Centers content using flexbox
  - Provides letterbox/pillarbox background for aspect ratio mismatches
-->
<div
  class={cn(
    "w-screen h-screen flex items-center justify-center",
    overflowClasses[overflow],
    className
  )}
  style:background={background ?? "var(--color-base-300, #1a1a1a)"}
  role="application"
  aria-label="Game board viewport"
  {...rest}
>
  {@render children()}
</div>
