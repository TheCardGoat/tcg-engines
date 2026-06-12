<script lang="ts">
import { cn, type WithElementRef } from "$lib/utils.js";
import type { HTMLAttributes } from "svelte/elements";

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<kbd
  bind:this={ref}
  data-slot="kbd"
  class={cn(
    "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/10 px-1.5 text-[0.68rem] font-semibold leading-none shadow-sm select-none",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</kbd>
