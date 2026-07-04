<script lang="ts">
  import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
  import * as HoverCard from "$lib/design-system/primitives/hover-card/index.js";

  let {
    name,
    set,
    cardNumber,
    cardType,
  }: {
    name: string;
    set?: string;
    cardNumber?: number | string;
    cardType?: string;
  } = $props();

  const preview = $derived(
    set != null && cardNumber != null ? { set, cardNumber } : null,
  );
</script>

{#if preview}
  <HoverCard.Root openDelay={140}>
    <HoverCard.Trigger
      class="inline cursor-help rounded-sm text-amber-100 underline decoration-amber-300/55 decoration-dotted underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      tabindex={0}
      aria-label={`${name}, show card preview`}
    >
      {name}
    </HoverCard.Trigger>
    <HoverCard.Content
      side="top"
      sideOffset={8}
      class="{cardType === 'location' ? 'w-[320px]' : 'w-60'} rounded-xl border-white/10 bg-slate-950/95 p-0 shadow-[0_24px_64px_-24px_rgba(2,6,23,0.95)]"
    >
      {#if cardType === "location"}
        <div class="relative overflow-hidden rounded-xl" style="height: 229px;">
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"
            style="width: 229px; height: 320px;"
          >
            <CardImage set={preview.set} number={preview.cardNumber} alt={name} class="h-full w-full" />
          </div>
        </div>
      {:else}
        <CardImage set={preview.set} number={preview.cardNumber} alt={name} class="w-full rounded-xl" />
      {/if}
    </HoverCard.Content>
  </HoverCard.Root>
{:else}
  <span
    class="text-amber-100 underline decoration-amber-300/55 decoration-dotted underline-offset-4"
  >
    {name}
  </span>
{/if}
