<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";

  type Position =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | "left-center"
    | "right-center";

  interface UIChromeProps {
    /** Position of the UI element relative to the viewport */
    position?: Position;
    /** Z-index for layering */
    zIndex?: number;
    /** Additional CSS classes */
    class?: string;
    /** Child content */
    children: Snippet;
  }

  const {
    position = "top-right",
    zIndex = 50,
    class: className,
    children,
  }: UIChromeProps = $props();

  // Position classes for fixed positioning
  const positionClasses: Record<Position, string> = {
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "left-center": "left-4 top-1/2 -translate-y-1/2",
    "right-center": "right-4 top-1/2 -translate-y-1/2",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };
</script>

<!--
  UIChrome: Fixed position overlay container
  - Position-fixed UI elements (life counters, menus, buttons)
  - Independent of board scaling
  - Positioned relative to the viewport, not the board
-->
<div
  class={cn(
    "fixed",
    positionClasses[position],
    className
  )}
  style:z-index={zIndex}
  role="complementary"
  aria-label="Game UI overlay"
>
  {@render children()}
</div>
