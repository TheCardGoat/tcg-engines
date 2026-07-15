<script lang="ts" module>
  export type SelectProps = {
    class?: string;
    value?: string;
  };
</script>

<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLSelectAttributes> = $props();
</script>

<select
  bind:this={ref}
  data-slot="select"
  class={cn(
    "border-input data-[placeholder]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 shadow-xs flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground",
    className,
  )}
  bind:value
  {...restProps}
>
  {@render children?.()}
</select>
