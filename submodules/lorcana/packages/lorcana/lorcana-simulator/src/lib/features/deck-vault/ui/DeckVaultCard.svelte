<script lang="ts">
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";
  import { getInkHex } from "@/features/simulator/model/lorcana-colors.js";
  import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
  import type { DeckVaultItem } from "../types.js";
  import DeckFormatBadges from "./DeckFormatBadges.svelte";
  import Check from "@lucide/svelte/icons/check";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Trash2 from "@lucide/svelte/icons/trash-2";

  interface Props {
    deck: DeckVaultItem;
    selected?: boolean;
    editUrl?: string;
    onSelect?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
  }

  let { deck, selected = false, editUrl, onSelect, onDelete, onEdit }: Props = $props();
</script>

<div
  role="button"
  tabindex="0"
  class="w-full cursor-pointer text-left rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none {selected ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-border hover:border-primary/50'} bg-card"
  onclick={onSelect}
  onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); } }}
>
  <!-- Ink color stripe -->
  <div class="flex h-1.5 overflow-hidden rounded-t-xl">
    {#each deck.inks as ink}
      <div class="flex-1" style="background-color: {getInkHex(ink)}"></div>
    {/each}
    {#if deck.inks.length === 0}
      <div class="flex-1 bg-muted"></div>
    {/if}
  </div>

  <div class="p-4 space-y-3">
    <!-- Name + selected badge -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug">
        {deck.name}
      </h3>
      <div class="flex items-center gap-1 shrink-0">
        {#if selected}
          <Badge variant="default" class="text-xs gap-1">
            <Check class="size-3" />
            {m["sim.matchmaking.matchmaking.selectedBadge"]({})}
          </Badge>
        {/if}
      </div>
    </div>

    <!-- Ink icons + archetype -->
    <div class="flex flex-wrap items-center gap-1.5">
      {#each deck.inks as ink}
        <img
          src={getInkSymbolUrl(ink)}
          alt={ink}
          class="size-4"
        />
      {/each}
      {#if deck.archetype}
        <Badge variant="outline" class="text-xs">{deck.archetype}</Badge>
      {/if}
    </div>

    <!-- Format badges -->
    <DeckFormatBadges formats={deck.validFormats} />

    <!-- Stats row -->
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <span>{deck.cardCount} cards</span>
      <div class="flex items-center gap-2">
        {#if onEdit}
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 cursor-pointer"
            onclick={(e: MouseEvent) => { e.stopPropagation(); onEdit(); }}
          >
            Edit
            <ExternalLink class="size-3" />
          </button>
        {:else if editUrl}
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            onclick={(e: MouseEvent) => e.stopPropagation()}
          >
            Edit
            <ExternalLink class="size-3" />
          </a>
        {/if}
        {#if onDelete}
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-300 cursor-pointer"
            onclick={(e: MouseEvent) => { e.stopPropagation(); onDelete(); }}
            aria-label={m["sim.deckVault.delete.aria"]({ deckName: deck.name })}
          >
            <Trash2 class="size-3" />
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
