<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import {
    fetchAtelierCatalog,
    purchaseAtelierHolding,
    type AtelierCatalog,
    type AtelierCatalogPrinting,
  } from "$lib/features/atelier/api/atelier-api.js";

  type Props = {
    open: boolean;
    canonicalId: string | null;
    gameSlug: string;
    gameProfileId: string;
    selectedPrintingShortId?: string | null;
    onSelect?: (printingShortId: string | null) => void;
    onClose?: () => void;
  };

  let {
    open = $bindable(false),
    canonicalId,
    gameSlug,
    gameProfileId,
    selectedPrintingShortId = null,
    onSelect,
    onClose,
  }: Props = $props();

  let catalog = $state<AtelierCatalog | null>(null);
  let loading = $state(false);
  let errorMessage = $state<string | null>(null);
  let busyPrintingShortId = $state<string | null>(null);

  async function loadCatalog() {
    if (!canonicalId) {
      catalog = null;
      return;
    }
    loading = true;
    errorMessage = null;
    try {
      catalog = await fetchAtelierCatalog({ gameSlug, canonicalId });
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Failed to load catalog";
      catalog = null;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (open && canonicalId) {
      void loadCatalog();
    }
  });

  async function handleBuy(printing: AtelierCatalogPrinting, sku: "rental" | "permanent") {
    busyPrintingShortId = printing.printingShortId;
    errorMessage = null;
    try {
      await purchaseAtelierHolding({
        gameSlug,
        gameProfileId,
        printingShortId: printing.printingShortId,
        sku,
      });
      await loadCatalog();
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Purchase failed";
    } finally {
      busyPrintingShortId = null;
    }
  }

  function handleSelect(printing: AtelierCatalogPrinting) {
    onSelect?.(printing.printingShortId);
    open = false;
    onClose?.();
  }

  function handleClear() {
    onSelect?.(null);
    open = false;
    onClose?.();
  }
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onClose?.()}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="max-w-2xl">
      <Dialog.Header>
        <Dialog.Title>Pick an alternate art</Dialog.Title>
        <Dialog.Description>
          Owned copies are honored at match time. Default art is used when no selection (or no
          owned copies) covers your deck.
        </Dialog.Description>
      </Dialog.Header>

      {#if errorMessage}
        <div class="rounded-md bg-rose-500/15 px-3 py-2 text-sm text-rose-200">
          {errorMessage}
        </div>
      {/if}

      {#if loading}
        <div class="text-sm text-muted-foreground">Loading catalog…</div>
      {:else if !catalog || catalog.printings.length === 0}
        <div class="text-sm text-muted-foreground">No printings available.</div>
      {:else}
        <ul class="max-h-[60vh] space-y-2 overflow-y-auto">
          {#each catalog.printings as p (p.printingShortId)}
            <li
              class="rounded-md border p-3 text-sm transition-colors {selectedPrintingShortId ===
              p.printingShortId
                ? 'border-sky-400 bg-sky-500/10'
                : 'border-white/10 bg-white/5'}"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-foreground">
                    {p.printingShortId} · Set {p.set} #{p.cardNumber}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {p.specialRarity ?? p.rarity}
                    {#if p.isDefault} · default art{/if}
                  </div>
                  <div class="mt-1 text-xs text-muted-foreground">
                    Owned: {p.ownedLiveCopies} live copy{p.ownedLiveCopies === 1 ? "" : "ies"}
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <button
                    type="button"
                    class="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
                    disabled={busyPrintingShortId === p.printingShortId}
                    onclick={() => handleBuy(p, "rental")}
                  >
                    Rent {catalog.rentalDays}d · {p.prices.rental}
                  </button>
                  <button
                    type="button"
                    class="rounded border border-sky-400/40 bg-sky-400/10 px-2 py-1 text-xs text-sky-200 hover:bg-sky-400/20 disabled:opacity-50"
                    disabled={busyPrintingShortId === p.printingShortId}
                    onclick={() => handleBuy(p, "permanent")}
                  >
                    Buy · {p.prices.permanent}
                  </button>
                  {#if p.ownedLiveCopies > 0}
                    <button
                      type="button"
                      class="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-400/20"
                      onclick={() => handleSelect(p)}
                    >
                      Use this art
                    </button>
                  {/if}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}

      <Dialog.Footer>
        <button
          type="button"
          class="rounded border border-white/15 px-3 py-1 text-sm text-muted-foreground hover:bg-white/5"
          onclick={handleClear}
        >
          Use default art
        </button>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
