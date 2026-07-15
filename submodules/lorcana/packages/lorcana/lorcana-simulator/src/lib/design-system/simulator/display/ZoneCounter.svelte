<script lang="ts">
  import { cn } from "$lib/utils.js";

  type ZoneCounterCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

  interface ZoneCounterProps {
    count: number | string;
    ariaLabel?: string;
    corner?: ZoneCounterCorner;
    class?: string;
  }

  let {
    count,
    ariaLabel,
    corner = "top-right",
    class: className,
  }: ZoneCounterProps = $props();

  const cornerClasses: Record<ZoneCounterCorner, string> = {
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    "top-left": "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
    "top-right": "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  };
</script>

<div
  class={cn(
    "pointer-events-none absolute z-10 inline-flex min-w-7 items-center justify-center rounded-full border px-2 py-1",
    "border-sky-200/30 bg-[linear-gradient(135deg,_rgba(22,49,82,0.98)_0%,_rgba(16,35,61,0.98)_100%)]",
    "text-[0.7rem] font-extrabold tabular-nums text-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
    cornerClasses[corner],
    className,
  )}
  aria-label={ariaLabel}
>
  {count}
</div>
