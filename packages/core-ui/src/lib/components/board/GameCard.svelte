<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utils.js";
  import Card from "./Card.svelte";

  interface GameCardProps {
    name: string;
    cost?: number | string;
    power?: number | string;
    toughness?: number | string;
    type?: string;
    description?: string;
    image?: string;
    rarity?: "common" | "uncommon" | "rare" | "mythic";
    faction?: string;

    // Card state passed to the wrapper
    tapped?: boolean;
    faceDown?: boolean;
    selected?: boolean;
    draggable?: boolean;
    hoverable?: boolean;

    class?: string;
    onclick?: (event: MouseEvent) => void;
  }

  const {
    name,
    cost,
    power,
    toughness,
    type,
    description,
    image,
    rarity = "common",
    faction,
    tapped,
    faceDown,
    selected,
    draggable,
    hoverable,
    class: className,
    onclick,
  }: GameCardProps = $props();

  const rarityColors = {
    common: "border-base-content/20",
    uncommon: "border-gray-400",
    rare: "border-yellow-400",
    mythic: "border-orange-600",
  };
</script>

<Card
  {tapped}
  {faceDown}
  {selected}
  {draggable}
  {hoverable}
  {onclick}
  class={className}
>
  <div
    class="flex flex-col h-full w-full bg-base-100 text-base-content relative"
  >
    <!-- Header -->
    <div
      class="px-2 py-1 flex justify-between items-center bg-base-200 text-xs font-bold border-b border-base-300"
    >
      <span class="truncate">{name}</span>
      {#if cost !== undefined}
        <div
          class="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-content shadow-sm"
        >
          {cost}
        </div>
      {/if}
    </div>

    <!-- Image Area -->
    <div class="relative flex-grow bg-base-300 overflow-hidden">
      {#if image}
        <img src={image} alt={name} class="w-full h-full object-cover">
      {:else}
        <div
          class="w-full h-full flex items-center justify-center text-base-content/20"
        >
          No Image
        </div>
      {/if}
    </div>

    <!-- Type Line -->
    {#if type}
      <div
        class="px-2 py-0.5 text-[0.6rem] uppercase tracking-wider bg-base-200 border-y border-base-300 font-semibold text-base-content/70"
      >
        {type}
      </div>
    {/if}

    <!-- Text Box -->
    <div
      class="p-2 text-[0.7rem] leading-tight overflow-hidden flex-grow-0 min-h-[30%] bg-base-100"
    >
      <p>{description || ""}</p>
    </div>

    <!-- Footer / Stats -->
    {#if power !== undefined || toughness !== undefined}
      <div class="absolute bottom-1 right-1 flex gap-1">
        <div
          class="px-2 py-0.5 rounded-full bg-secondary text-secondary-content font-bold text-xs shadow-md border border-base-content/10"
        >
          {power}/{toughness}
        </div>
      </div>
    {/if}

    <!-- Rarity Gem/Border indicator (optional) -->
    <div
      class={cn("absolute inset-0 border-2 pointer-events-none rounded-lg", rarityColors[rarity])}
    ></div>
  </div>

  {#snippet cardBack()}
    <div
      class="w-full h-full bg-neutral text-neutral-content flex items-center justify-center relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]"
      ></div>
      <div
        class="w-16 h-16 rounded-full border-4 border-neutral-content/30 flex items-center justify-center bg-neutral-focus z-10"
      >
        <span class="text-2xl">⚡</span>
      </div>
    </div>
  {/snippet}
</Card>
