<script lang="ts">
  import CircleIcon from "@lucide/svelte/icons/circle";
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: RadioGroupPrimitive.ItemProps = $props();
</script>

<RadioGroupPrimitive.Item
  bind:ref
  data-slot="radio-group-item"
  class={cn(
    "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  {...restProps}
>
  {#snippet child({ checked })}
    {#if children}
      {@render children({ checked })}
    {:else if checked}
      <span class="flex items-center justify-center">
        <CircleIcon class="size-2 fill-current text-current" />
      </span>
    {/if}
  {/snippet}
</RadioGroupPrimitive.Item>
