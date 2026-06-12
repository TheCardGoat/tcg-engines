<script lang="ts">
  import { ArrowDownToLine, ArrowUpToLine, Crosshair } from "@lucide/svelte";
  import { m } from "$lib/i18n/messages.js";
  import type {
    ActivePlayerGuidanceItem,
    GuidanceAnchor,
  } from "@/features/simulator/model/active-player-guidance.js";
  import { maybeUseSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
  import NamedCardSearchInput from "@/features/simulator/panels/NamedCardSearchInput.svelte";
  import ResolutionAmountControls from "@/features/simulator/panels/ResolutionAmountControls.svelte";
  import CardTextWithSymbols from "@/design-system/simulator/cards/CardTextWithSymbols.svelte";

  interface ActivePlayerGuidanceProps {
    items?: ActivePlayerGuidanceItem[];
    anchor?: GuidanceAnchor;
    isBottomHandExpanded?: boolean;
    isTopHandExpanded?: boolean;
    onToggleAnchor?: () => void;
    canOpenTargetModal?: boolean;
    onOpenTargetModal?: () => void;
    onAmountChange?: (value: number) => void;
  }

  let { items = [], anchor = "bottom", isBottomHandExpanded = false, isTopHandExpanded = false, onToggleAnchor, canOpenTargetModal = false, onOpenTargetModal, onAmountChange }: ActivePlayerGuidanceProps = $props();

  const PAGE_SIZE = 3;
  let page = $state(0);

  $effect(() => {
    // Reset to first page when items change
    void items;
    page = 0;
  });

  const pageCount = $derived(Math.ceil(items.length / PAGE_SIZE));
  const visibleItems = $derived(items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE));
  const handTargetable = $derived(visibleItems.some((item) => item.mode === "pregame"));
  const isTopAnchor = $derived(anchor === "top");
  const toggleTitle = $derived(isTopAnchor ? "Move guidance to bottom" : "Move guidance to top");
  const needsHandClearance = $derived(
    (anchor === "bottom" && isBottomHandExpanded) ||
    (anchor === "top" && isTopHandExpanded),
  );
  const simulatorCardContext = maybeUseSimulatorCardContext();

  function handleReferencePreviewEnter(card: LorcanaCardSnapshot | null): void {
    if (!card?.isMasked) {
      simulatorCardContext?.setExternalPreviewCard(card);
    }
  }

  function handleReferencePreviewLeave(card: LorcanaCardSnapshot | null): void {
    if (
      card &&
      !card.isMasked &&
      simulatorCardContext?.previewCard?.cardId === card.cardId
    ) {
      simulatorCardContext.setExternalPreviewCard(null);
    }
  }

  function hasSelectedTargetSlot(item: ActivePlayerGuidanceItem): boolean {
    return item.targetSlots?.some((slot) => slot.selected) ?? false;
  }
</script>

{#if items.length > 0}
  <div
    class="guidance-anchor"
    class:guidance-anchor--top={anchor === "top"}
    class:guidance-anchor--bottom={anchor === "bottom"}
    class:guidance-anchor--hand-target-bottom={(handTargetable || needsHandClearance) && anchor === "bottom"}
    class:guidance-anchor--hand-target-top={(handTargetable || needsHandClearance) && anchor === "top"}
  >
    <div class="guidance-stack" role="region" aria-label={m["sim.guidance.aria"]({})}>

      {#if pageCount > 1}
        <div class="guidance-pagination">
          <button
            type="button"
            class="guidance-page-btn"
            disabled={page === 0}
            onclick={() => page--}
            aria-label="Previous guidance items"
          >‹</button>
          <span class="guidance-page-indicator">{page + 1} / {pageCount}</span>
          <button
            type="button"
            class="guidance-page-btn"
            disabled={page >= pageCount - 1}
            onclick={() => page++}
            aria-label="Next guidance items"
          >›</button>
          <span class="guidance-total-count">{items.length} total</span>
        </div>
      {/if}

      {#each visibleItems as item, index (item.id)}
        <section class="guidance-pill relative" class:guidance-pill--has-search={Boolean(item.namedCardSearch)} class:guidance-pill--has-description={Boolean(item.abilityDescription)} class:guidance-pill--has-amount={Boolean(item.amountSelection)} data-mode={item.mode}>
          {#if index === 0}
            <button
              type="button"
              class="guidance-toggle guidance-toggle--icon-only absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
              class:guidance-toggle--top={isTopAnchor}
              onclick={onToggleAnchor}
              aria-label={toggleTitle}
              title={toggleTitle}
              aria-pressed={isTopAnchor}
              data-guidance-position={anchor}
            >
              {#if isTopAnchor}
                <ArrowDownToLine class="size-4" />
              {:else}
                <ArrowUpToLine class="size-4" />
              {/if}
            </button>
          {/if}
          <p
            class="guidance-message"
            class:guidance-message--with-inline-reference={Boolean(item.inlineReference)}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {#if item.inlineReference}
              <CardTextWithSymbols text={item.inlineReference.prefix ?? ""} />
              <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_static_element_interactions -->
              <span
                class="guidance-message-reference"
                role={item.inlineReference.card ? "button" : undefined}
                tabindex={item.inlineReference.card ? 0 : undefined}
                onmouseenter={() => handleReferencePreviewEnter(item.inlineReference?.card ?? null)}
                onmouseleave={() => handleReferencePreviewLeave(item.inlineReference?.card ?? null)}
                onfocus={() => handleReferencePreviewEnter(item.inlineReference?.card ?? null)}
                onblur={() => handleReferencePreviewLeave(item.inlineReference?.card ?? null)}
              >
                <CardTextWithSymbols text={item.inlineReference.label} />
              </span>
              <CardTextWithSymbols text={item.inlineReference.suffix ?? ""} />
            {:else}
              <CardTextWithSymbols text={item.message} />
            {/if}
          </p>

          {#if item.abilityDescription && !hasSelectedTargetSlot(item)}
            <p class="guidance-ability-description">
              <CardTextWithSymbols text={item.abilityDescription} />
            </p>
          {/if}

          {#if item.targetSlots && item.targetSlots.length > 0 && hasSelectedTargetSlot(item)}
            <div class="guidance-target-slots" aria-label="Selected targets">
              {#each item.targetSlots as slot (slot.id)}
                <div
                  class="guidance-target-slot"
                  class:guidance-target-slot--active={slot.active}
                  class:guidance-target-slot--selected={slot.selected}
                >
                  <span class="guidance-target-slot__label">{slot.label}</span>
                  <span class="guidance-target-slot__detail">{slot.detail}</span>
                  <span class="guidance-target-slot__status">
                    {slot.selected ? "Selected" : slot.active ? "Choosing now" : "Next"}
                  </span>
                </div>
              {/each}
            </div>
          {/if}

          {#if item.namedCardSearch}
            <div class="guidance-search">
              <NamedCardSearchInput
                query={item.namedCardSearch.query}
                results={item.namedCardSearch.results}
                oninput={item.namedCardSearch.oninput}
                onselect={item.namedCardSearch.onselect}
                compact />
            </div>
          {/if}

          {#if item.actions.length > 0 || (index === 0 && canOpenTargetModal && onOpenTargetModal)}
            <div class="guidance-actions">
              {#if item.amountSelection}
                <ResolutionAmountControls
                  selection={item.amountSelection}
                  variant="inline"
                  onChange={(value) => {
                    onAmountChange?.(value);
                  }}
                />
              {/if}
              {#if index === 0 && canOpenTargetModal && onOpenTargetModal}
                <button
                  type="button"
                  class="guidance-action guidance-action--target"
                  onclick={onOpenTargetModal}
                  aria-label="Open target selector"
                  title="Open target selector"
                >
                  <Crosshair class="size-3.5" />
                </button>
              {/if}
              {#each item.actions as action (action.id)}
                <button
                  type="button"
                  class="guidance-action"
                  class:guidance-action--emphasis={action.emphasis}
                  disabled={action.disabled}
                  onclick={action.onClick}
                >
                  <CardTextWithSymbols text={action.label} />
                </button>
              {/each}
            </div>
          {/if}
        </section>
      {/each}
    </div>
  </div>
{/if}

<style>
  .guidance-anchor {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: min(48rem, calc(100% - 1rem));
    pointer-events: none;
    display: flex;
    justify-content: center;
    z-index: 30;
  }

  .guidance-stack {
    width: min(48rem, calc(100% - 1rem));
    display: grid;
    gap: 0.55rem;
  }

  .guidance-anchor--bottom {
    bottom: calc(var(--hand-guidance-offset, 5.25rem) + var(--hand-guidance-clearance, 1.2rem));
  }

  .guidance-anchor--hand-target-bottom {
    bottom: calc(var(--hand-zone-height, 8rem) + var(--hand-guidance-clearance, 2rem));
  }

  .guidance-anchor--top {
    top: calc(var(--hand-guidance-offset, 5.25rem) + var(--hand-guidance-clearance, 1.2rem));
  }

  .guidance-anchor--hand-target-top {
    top: calc(var(--hand-zone-height, 8rem) + var(--hand-guidance-clearance, 2rem));
  }

  .guidance-pagination {
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    border: 1px solid rgba(130, 178, 235, 0.28);
    background: rgba(7, 18, 33, 0.82);
    backdrop-filter: blur(6px);
    align-self: center;
    width: fit-content;
    margin: 0 auto;
  }

  .guidance-page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 999px;
    border: 1px solid rgba(130, 178, 235, 0.4);
    background: rgba(17, 48, 81, 0.82);
    color: #e8f1fc;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
  }

  .guidance-page-btn:hover:not(:disabled) {
    background: rgba(37, 76, 120, 0.98);
    border-color: rgba(192, 226, 255, 0.88);
    transform: translateY(-1px);
  }

  .guidance-page-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .guidance-page-indicator {
    color: #e8f1fc;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    min-width: 2.5rem;
    text-align: center;
  }

  .guidance-total-count {
    color: rgba(200, 220, 248, 0.6);
    font-size: 0.68rem;
    letter-spacing: 0.04em;
  }

  .guidance-pill {
    pointer-events: auto;
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
    max-width: 100%;
    align-items: center;
    gap: 0.7rem;
    z-index: 30;
    padding: 0.52rem 0.6rem 0.52rem 0.85rem;
    border-radius: 16px;
    border: 1px solid rgba(130, 178, 235, 0.56);
    background:
      linear-gradient(180deg, rgba(9, 24, 43, 0.94) 0%, rgba(7, 18, 33, 0.94) 100%);
    backdrop-filter: blur(6px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }

  .guidance-toggle {
    pointer-events: auto;
    min-height: 2rem;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid rgba(130, 178, 235, 0.56);
    background: rgba(7, 18, 33, 0.96);
    color: #e8f1fc;
    padding: 0.38rem 0.72rem;
    font-size: 0.5rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
    transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
  }

  .guidance-toggle:hover {
    background: rgba(17, 48, 81, 0.98);
    border-color: rgba(192, 226, 255, 0.88);
    transform: translateY(-1px);
  }

  .guidance-toggle--top {
    border-color: rgba(125, 211, 252, 0.58);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.92), rgba(8, 47, 73, 0.96));
    color: #f8fbff;
  }

  .guidance-toggle--icon-only {
    width: 2.2rem;
    min-width: 2.2rem;
    min-height: 2.2rem;
    justify-content: center;
    padding: 0;
    border-color: rgba(130, 178, 235, 0.36);
    background: rgba(5, 14, 26, 0.92);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .guidance-pill--has-search {
    grid-template-columns: 1fr;
  }

  .guidance-pill--has-description {
    grid-template-columns: 1fr;
  }

  .guidance-search {
    width: 100%;
  }

  .guidance-message {
    margin: 0;
    color: #f2f7ff;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    line-height: 1.2;
    white-space: pre-line;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
  }

  .guidance-message--with-inline-reference {
    font-weight: 500;
  }

  .guidance-message-reference {
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 0.12em;
    cursor: help;
  }

  .guidance-message-reference:focus-visible {
    outline: 2px solid rgba(247, 220, 134, 0.9);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .guidance-ability-description {
    margin: 0;
    color: rgba(200, 220, 248, 0.75);
    font-size: 0.78rem;
    font-style: italic;
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 1.35;
    white-space: pre-line;
  }

  .guidance-target-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0.35rem;
  }

  .guidance-target-slot {
    min-width: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.42rem;
    padding: 0.34rem 0.48rem;
    border-radius: 8px;
    border: 1px solid rgba(130, 178, 235, 0.24);
    background: rgba(5, 16, 30, 0.56);
  }

  .guidance-target-slot--active {
    border-color: rgba(251, 191, 36, 0.72);
    background: rgba(120, 69, 8, 0.32);
    box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.18);
  }

  .guidance-target-slot--selected:not(.guidance-target-slot--active) {
    border-color: rgba(94, 234, 212, 0.42);
    background: rgba(13, 82, 76, 0.28);
  }

  .guidance-target-slot__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    min-height: 1.55rem;
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.14);
    color: #eaf4ff;
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .guidance-target-slot__detail {
    min-width: 0;
    color: #f8fbff;
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .guidance-target-slot__status {
    color: rgba(191, 219, 254, 0.72);
    font-size: 0.63rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .guidance-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
    flex-wrap: wrap;
  }

  .guidance-action {
    min-height: 2rem;
    border-radius: 10px;
    border: 1px solid rgba(173, 210, 246, 0.54);
    background: rgba(17, 48, 81, 0.95);
    color: #e8f1fc;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    line-height: 1.1;
    padding: 0.42rem 0.72rem;
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  .guidance-action:hover:enabled {
    background: rgba(37, 76, 120, 0.98);
    border-color: rgba(192, 226, 255, 0.88);
    transform: translateY(-1px);
  }

  .guidance-action--target {
    width: 2rem;
    min-width: 2rem;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .guidance-action--emphasis {
    border-color: rgba(247, 220, 134, 0.9);
    background:
      linear-gradient(180deg, rgba(200, 130, 18, 0.98) 0%, rgba(171, 98, 6, 0.98) 100%);
    color: #fff5d8;
    box-shadow: 0 0 0 1px rgba(255, 214, 122, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.24);
  }

  .guidance-action--emphasis:hover:enabled {
    background:
      linear-gradient(180deg, rgba(220, 149, 29, 0.99) 0%, rgba(194, 116, 15, 0.99) 100%);
  }

  .guidance-action:disabled {
    opacity: 0.54;
    cursor: default;
    transform: none;
  }

  @media (max-width: 900px) {
    .guidance-anchor--bottom {
      bottom: calc(var(--hand-zone-height, 10rem) + var(--hand-guidance-clearance, 2rem) + 0.75rem);
    }

    .guidance-anchor--hand-target-bottom {
      bottom: calc(var(--hand-zone-height, 10rem) + var(--hand-guidance-clearance, 2rem) + 0.75rem);
    }

    .guidance-stack {
      width: 100%;
    }

    .guidance-pill {
      grid-template-columns: 1fr;
      text-align: left;
      border-radius: 14px;
      gap: 0.45rem;
      padding: 0.5rem 0.58rem;
    }

    .guidance-message {
      width: 100%;
      font-size: 0.82rem;
      line-height: 1.15;
      white-space: normal;
    }

    .guidance-target-slots {
      grid-template-columns: 1fr;
    }

    .guidance-actions {
      width: 100%;
      justify-content: flex-start;
      gap: 0.35rem;
    }

    .guidance-action {
      min-height: 1.85rem;
      font-size: 0.74rem;
      padding: 0.36rem 0.64rem;
    }

    .guidance-toggle {
      min-height: 1.8rem;
      padding: 0.3rem 0.56rem;
      font-size: 0.62rem;
    }

    .guidance-toggle--icon-only {
      min-width: 1.9rem;
      min-height: 1.9rem;
    }
  }
</style>
