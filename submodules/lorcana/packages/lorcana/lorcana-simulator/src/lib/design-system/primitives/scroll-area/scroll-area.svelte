<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  interface ScrollAreaProps {
    class?: string;
    viewportClass?: string;
    children?: Snippet;
  }

  let {
    class: className,
    viewportClass = "",
    children,
  }: ScrollAreaProps = $props();
</script>

<div
  data-slot="scroll-area"
  class={cn("relative min-h-0 overflow-hidden", className)}
>
  <div
    data-slot="scroll-area-viewport"
    class={cn("h-full w-full overflow-y-auto overscroll-contain", viewportClass)}
  >
    {@render children?.()}
  </div>
</div>

<style>
  [data-slot="scroll-area-viewport"] {
    scrollbar-width: thin;
    scrollbar-color: rgba(125, 211, 252, 0.32) rgba(15, 23, 42, 0.4);
  }

  [data-slot="scroll-area-viewport"]::-webkit-scrollbar {
    width: 8px;
  }

  [data-slot="scroll-area-viewport"]::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.4);
  }

  [data-slot="scroll-area-viewport"]::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.32);
  }

  [data-slot="scroll-area-viewport"]::-webkit-scrollbar-thumb:hover {
    background: rgba(125, 211, 252, 0.46);
  }
</style>
