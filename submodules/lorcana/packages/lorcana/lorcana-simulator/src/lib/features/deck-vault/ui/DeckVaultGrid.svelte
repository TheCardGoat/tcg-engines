<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { DeckVaultItem } from "../types.js";
  import DeckVaultCard from "./DeckVaultCard.svelte";
  import DeckVaultEmptyState from "./DeckVaultEmptyState.svelte";

  interface Props {
    decks: DeckVaultItem[];
    selectedDeckId?: string | null;
    onSelect?: (deck: DeckVaultItem) => void;
    onDelete?: (deck: DeckVaultItem) => void;
    onEdit?: (deck: DeckVaultItem) => void;
    getEditUrl?: (deck: DeckVaultItem) => string | undefined;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionLabel?: string;
    onEmptyAction?: () => void;
    class?: string;
  }

  let {
    decks,
    selectedDeckId = null,
    onSelect,
    onDelete,
    onEdit,
    getEditUrl,
    emptyTitle,
    emptyDescription,
    emptyActionLabel,
    onEmptyAction,
    class: className,
  }: Props = $props();
</script>

{#if decks.length === 0}
  <DeckVaultEmptyState
    title={emptyTitle}
    description={emptyDescription}
    actionLabel={emptyActionLabel}
    onAction={onEmptyAction}
  />
{:else}
  <div class={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
    {#each decks as deck (deck.id)}
      <DeckVaultCard
        {deck}
        selected={deck.id === selectedDeckId}
        editUrl={onEdit ? undefined : getEditUrl?.(deck)}
        onEdit={onEdit ? () => onEdit(deck) : undefined}
        onSelect={onSelect ? () => onSelect?.(deck) : undefined}
        onDelete={onDelete ? () => onDelete?.(deck) : undefined}
      />
    {/each}
  </div>
{/if}
