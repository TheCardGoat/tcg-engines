<script lang="ts">
  import {
    ArrowDownToLine,
    ArrowUpToLine,
    ChevronDown,
    ChevronUp,
    Crosshair,
    Expand,
    Minus,
    Shrink,
  } from '@lucide/svelte';

  import CardImage from '@/design-system/simulator/cards/CardImage.svelte';
  import CardLogToken from '@/features/simulator/panels/CardLogToken.svelte';
  import NamedCardSearchInput from '@/features/simulator/panels/NamedCardSearchInput.svelte';
  import { maybeUseSimulatorCardContext } from '@/features/simulator/context/simulator-card-context.svelte.js';
  import type { LorcanaCardSnapshot } from '@/features/simulator/model/contracts.js';
  import {
    DEFAULT_PENDING_EFFECTS_VIEW_MODE,
    persistPendingEffectsViewModePreference,
    readPendingEffectsViewModePreference,
    type PendingEffectsViewMode,
  } from '@/features/simulator/panels/pending-effects-view-preference.js';
  import {
    shouldAutoOpenPendingEffects,
  } from '@/features/simulator/panels/pending-effects-popover-state.js';
  import type {
    GuidanceAction,
    NamedCardSearchState,
  } from '@/features/simulator/model/active-player-guidance.js';

  export interface PendingEffectsPopoverItem {
    id: string;
    kind: 'bag' | 'pending';
    title: string;
    secondaryTitle?: string;
    summaryTitle?: string;
    subtitle: string;
    detail: string;
    badge: string;
    card: LorcanaCardSnapshot | null;
    instanceReferences?: Array<{
      id: string;
      label: string;
      cardId: string;
      card: LorcanaCardSnapshot | null;
    }>;
    isActive?: boolean;
    isLocalPlayer?: boolean;
    canResolve?: boolean;
    canAccept?: boolean;
    canReject?: boolean;
    disabledReason?: string;
    primaryActionLabel?: string;
    onResolve?: () => void;
    onPrimaryAction?: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    statusMessage?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    inlineActions?: GuidanceAction[];
    namedCardSearch?: NamedCardSearchState;
  }

  interface PendingEffectsPopoverProps {
    items: PendingEffectsPopoverItem[];
    open?: boolean;
    canOpenTargetModal?: boolean;
    onOpenTargetModal?: () => void;
    initialDockPosition?: PendingEffectsDockPosition;
    hasActiveOverlay?: boolean;
  }

  type ViewMode = PendingEffectsViewMode;
  type PendingEffectsDockPosition = 'middle' | 'top' | 'bottom';

  let {
    items,
    open = $bindable(false),
    canOpenTargetModal = false,
    onOpenTargetModal,
    initialDockPosition = 'middle',
    hasActiveOverlay = false,
  }: PendingEffectsPopoverProps = $props();
  const simulatorCardContext = maybeUseSimulatorCardContext();

  let viewMode = $state<ViewMode>(DEFAULT_PENDING_EFFECTS_VIEW_MODE);
  let dockPosition = $state<PendingEffectsDockPosition>('middle');
  let hasHydratedDockPosition = $state(false);

  let dragOffset = $state<{ x: number; y: number } | null>(null);
  let isDragging = $state(false);
  let dragStart = $state<{ pointerX: number; pointerY: number; offsetX: number; offsetY: number } | null>(null);

  function handleDragPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    const currentOffset = dragOffset ?? { x: 0, y: 0 };
    dragStart = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: currentOffset.x,
      offsetY: currentOffset.y,
    };
    isDragging = false;
    event.preventDefault();
  }

  function handleDragPointerMove(event: PointerEvent): void {
    if (!dragStart) return;
    const dx = event.clientX - dragStart.pointerX;
    const dy = event.clientY - dragStart.pointerY;
    if (!isDragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      isDragging = true;
    }
    if (isDragging) {
      dragOffset = { x: dragStart.offsetX + dx, y: dragStart.offsetY + dy };
    }
  }

  function handleDragPointerUp(event: PointerEvent): void {
    if (!isDragging) {
      handleReminderClick();
    }
    dragStart = null;
    isDragging = false;
  }

  $effect(() => {
    if (!open) {
      dragOffset = null;
    }
  });

  $effect(() => {
    if (!hasHydratedDockPosition) {
      dockPosition = initialDockPosition;
      hasHydratedDockPosition = true;
    }
  });
  let hasHydratedViewModePreference = $state(false);
  let previousItemCount = $state(0);
  let previousActionableSignature = $state('');
  let userManuallyOpenedWhileOverlayActive = $state(false);

  function ownerSortKey(item: PendingEffectsPopoverItem): number {
    if (item.isLocalPlayer === true) return 0;
    if (item.isLocalPlayer === false) return 1;
    return 2;
  }

  const itemCount = $derived(items.length);
  const bagCount = $derived(items.filter((item) => item.kind === 'bag').length);
  const pendingCount = $derived(
    items.filter((item) => item.kind === 'pending').length,
  );
  const hasOpponentItems = $derived(items.some((item) => item.isLocalPlayer === false));
  const localPlayerIsActive = $derived(
    items.some(
      (item) =>
        item.isLocalPlayer !== false &&
        Boolean(
          (item.canResolve && item.onResolve) ||
          (item.canAccept && item.onAccept) ||
          (item.canReject && item.onReject),
        ),
    ),
  );
  const hasMultipleOwners = $derived(
    items.some((item) => item.isLocalPlayer === true) && hasOpponentItems,
  );
  const sortedItems = $derived(
    hasMultipleOwners
      ? [...items].sort((a, b) => ownerSortKey(a) - ownerSortKey(b))
      : items,
  );

  type EffectSection = {
    label: string;
    key: string;
    items: PendingEffectsPopoverItem[];
  };
  const displaySections = $derived((): EffectSection[] => {
    if (!hasMultipleOwners) {
      return [{ label: '', key: 'all', items: sortedItems }];
    }
    const sections: EffectSection[] = [];
    for (const item of sortedItems) {
      const key =
        item.isLocalPlayer === true
          ? 'you'
          : item.isLocalPlayer === false
            ? 'opp'
            : 'unknown';
      const label =
        item.isLocalPlayer === true
          ? 'Your triggers'
          : item.isLocalPlayer === false
            ? "Opponent's triggers"
            : 'Other';
      const last = sections[sections.length - 1];
      if (last && last.key === key) {
        last.items.push(item);
      } else {
        sections.push({ label, key, items: [item] });
      }
    }
    return sections;
  });
  const groupedReminderItems = $derived(buildGroupedReminderItems(sortedItems));

  function buildGroupedReminderItems(
    source: PendingEffectsPopoverItem[],
  ): Array<{ label: string; count: number; isLocalPlayer?: boolean }> {
    // Aggregate by (label + owner) across all positions, preserving first-seen order within each owner group
    type Entry = {
      label: string;
      count: number;
      isLocalPlayer?: boolean;
      firstIndex: number;
    };
    const map = new Map<string, Entry>();
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      const label = item.statusMessage ?? item.title;
      const mapKey = `${String(item.isLocalPlayer)}::${label}`;
      const existing = map.get(mapKey);
      if (existing) {
        existing.count++;
      } else {
        map.set(mapKey, {
          label,
          count: 1,
          isLocalPlayer: item.isLocalPlayer,
          firstIndex: i,
        });
      }
    }
    return [...map.values()]
      .sort((a, b) => {
        const ownerDiff =
          ownerSortKey({
            isLocalPlayer: a.isLocalPlayer,
          } as PendingEffectsPopoverItem) -
          ownerSortKey({
            isLocalPlayer: b.isLocalPlayer,
          } as PendingEffectsPopoverItem);
        return ownerDiff !== 0 ? ownerDiff : a.firstIndex - b.firstIndex;
      })
      .map(({ label, count, isLocalPlayer }) => ({
        label,
        count,
        isLocalPlayer,
      }));
  }
  const activeItem = $derived(
    items.find((item) => item.isActive) ?? items[0] ?? null,
  );
  const actionableSignature = $derived(
    items
      .filter((item) => isActionable(item))
      .map((item) => `${item.id}:${getActionSignature(item)}`)
      .join('|'),
  );

  $effect(() => {
    if (hasActiveOverlay) {
      if (open && !userManuallyOpenedWhileOverlayActive) {
        open = false;
      }
    } else {
      userManuallyOpenedWhileOverlayActive = false;
    }
  });

  $effect(() => {
    if (itemCount === 0) {
      open = false;
      previousItemCount = 0;
      previousActionableSignature = '';
      return;
    }

    if (
      shouldAutoOpenPendingEffects({
        itemCount,
        bagCount,
        pendingCount,
        hasOpponentItems,
        actionableSignature,
        previousItemCount,
        previousActionableSignature,
        localPlayerIsActive,
        hasActiveOverlay,
      })
    ) {
      open = true;
    }

    previousItemCount = itemCount;
    previousActionableSignature = actionableSignature;
  });

  $effect(() => {
    if (hasHydratedViewModePreference || typeof localStorage === 'undefined') {
      return;
    }

    viewMode = readPendingEffectsViewModePreference(localStorage);
    hasHydratedViewModePreference = true;
  });

  $effect(() => {
    if (!hasHydratedViewModePreference || typeof localStorage === 'undefined') {
      return;
    }

    persistPendingEffectsViewModePreference(localStorage, viewMode);
  });

  function isActionable(item: PendingEffectsPopoverItem): boolean {
    return Boolean(
      item.statusMessage ||
        item.onPrimaryAction ||
        (item.canResolve && item.onResolve) ||
        (item.canAccept && item.onAccept) ||
        (item.canReject && item.onReject),
    );
  }

  function getActionSignature(item: PendingEffectsPopoverItem): string {
    return [
      item.statusMessage ? `status:${item.statusMessage}` : null,
      item.onPrimaryAction ? 'primary' : null,
      item.canResolve && item.onResolve ? 'resolve' : null,
      item.canAccept && item.onAccept ? 'accept' : null,
      item.canReject && item.onReject ? 'reject' : null,
    ]
      .filter((value): value is string => Boolean(value))
      .join(':');
  }

  function getActionButtonCount(item: PendingEffectsPopoverItem): number {
    if (item.statusMessage) {
      return (
        (item.inlineActions?.length ?? 0) +
        Number(Boolean(item.onConfirm)) +
        Number(Boolean(item.onCancel))
      );
    }

    return (
      Number(Boolean(item.onPrimaryAction)) +
      Number(Boolean(item.canResolve && item.onResolve)) +
      Number(Boolean(item.canAccept && item.onAccept)) +
      Number(Boolean(item.canReject && item.onReject))
    );
  }

  function shouldShowCompactStatusMessage(
    item: PendingEffectsPopoverItem,
  ): boolean {
    return Boolean(item.statusMessage) && getActionButtonCount(item) === 0;
  }

  function shouldShowCompactDisabledReason(
    item: PendingEffectsPopoverItem,
  ): boolean {
    return Boolean(item.disabledReason) && getActionButtonCount(item) === 0;
  }

  function showCompactMeta(): boolean {
    return viewMode === 'normal';
  }

  function handleReminderClick(): void {
    open = !open;
    if (open && hasActiveOverlay) {
      userManuallyOpenedWhileOverlayActive = true;
    }
  }

  function minimizePanel(): void {
    open = false;
  }

  function toggleViewMode(): void {
    viewMode = viewMode === 'normal' ? 'compact' : 'normal';
  }

  function centerPanel(): void {
    dockPosition = 'middle';
  }

  function movePanelTo(
    position: Exclude<PendingEffectsDockPosition, 'middle'>,
  ): void {
    dockPosition = position;
  }

  function getDockOptionTitle(position: PendingEffectsDockPosition): string {
    switch (position) {
      case 'top':
        return 'Move panel to top';
      case 'middle':
        return 'Center panel';
      case 'bottom':
        return 'Move panel to bottom';
    }
  }

  function handleResolve(item: PendingEffectsPopoverItem): void {
    item.onResolve?.();
  }

  function handlePrimaryAction(item: PendingEffectsPopoverItem): void {
    item.onPrimaryAction?.();
  }

  function handleAccept(item: PendingEffectsPopoverItem): void {
    item.onAccept?.();
  }

  function handleReject(item: PendingEffectsPopoverItem): void {
    item.onReject?.();
  }

  function handleCardPreviewEnter(card: LorcanaCardSnapshot | null): void {
    if (!card?.isMasked) {
      simulatorCardContext?.setExternalPreviewCard(card);
    }
  }

  function handleCardPreviewLeave(card: LorcanaCardSnapshot | null): void {
    if (
      !card?.isMasked &&
      simulatorCardContext?.previewCard?.cardId === card?.cardId
    ) {
      simulatorCardContext?.setExternalPreviewCard(null);
    }
  }

  function handleOpenGlobalPreview(card: LorcanaCardSnapshot | null): void {
    if (!card?.isMasked) {
      simulatorCardContext?.openGlobalPreview(card);
    }
  }
</script>

{#if itemCount > 0}
  <button
    type="button"
    class="pending-effects-reminder"
    class:pending-effects-reminder--dragging={isDragging}
    data-queue-anchor="reminder"
    data-state={open ? 'open' : 'closed'}
    style={dragOffset ? `transform: translate(${dragOffset.x}px, ${dragOffset.y}px)` : undefined}
    onpointerdown={handleDragPointerDown}
    onpointermove={handleDragPointerMove}
    onpointerup={handleDragPointerUp}
    aria-expanded={open}
    aria-controls="pending-effects-panel"
  >
    <span class="trigger-label">Effects</span>
    <span class="trigger-count">{itemCount}</span>
    <span class="trigger-toggle-indicator" aria-hidden="true">
      {#if open}
        <ChevronUp size={15} strokeWidth={2.4} />
      {:else}
        <ChevronDown size={15} strokeWidth={2.4} />
      {/if}
    </span>
    <!-- <span class="trigger-breakdown">{bagCount} bag · {pendingCount} actions</span> -->
    <div class="trigger-current-list">
      {#each groupedReminderItems as group, i (i)}
        <span class="trigger-current">
          {#if group.count > 1}<span class="trigger-count-badge"
              >{group.count}×</span
            >{/if}{group.label}
        </span>
      {/each}
    </div>
  </button>

  {#if open}
    <div
      class="pending-effects-panel-anchor"
      data-queue-anchor="panel"
      data-dock-position={dockPosition}
    >
      <section
        id="pending-effects-panel"
        class="pending-effects-panel"
        class:pending-effects-panel--compact={viewMode === 'compact'}
        data-view-mode={viewMode}
        data-dock-position={dockPosition}
        aria-label="Pending effects and bag"
      >
        <div
          class="panel-header"
          role="group"
          aria-label="Pending effects header"
        >
          <div class="panel-title-block">
            <div class="panel-title-copy">
              <h2 class="panel-title">Pending effects</h2>
              <p class="panel-subtitle">Resolve triggers</p>
            </div>
          </div>
          <div
            class="panel-controls"
            role="toolbar"
            aria-label="Pending effects controls"
          >
            <span
              class="panel-count"
              aria-label={`${itemCount} pending effects`}
            >
              {itemCount}
            </span>
            <div
              class="panel-placement-control"
              role="group"
              aria-label="Panel placement"
            >
              <div class="panel-placement-options">
                <button
                  type="button"
                  class="header-icon-button header-icon-button--placement"
                  class:header-icon-button--active={dockPosition === 'top'}
                  onclick={() => movePanelTo('top')}
                  aria-pressed={dockPosition === 'top'}
                  aria-label={getDockOptionTitle('top')}
                  title={getDockOptionTitle('top')}
                  data-dock-option="top"
                >
                  <ArrowUpToLine size={13} strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  class="header-icon-button header-icon-button--placement"
                  class:header-icon-button--active={dockPosition === 'middle'}
                  onclick={centerPanel}
                  aria-pressed={dockPosition === 'middle'}
                  aria-label={getDockOptionTitle('middle')}
                  title={getDockOptionTitle('middle')}
                  data-dock-option="middle"
                >
                  <Minus size={13} strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  class="header-icon-button header-icon-button--placement"
                  class:header-icon-button--active={dockPosition === 'bottom'}
                  onclick={() => movePanelTo('bottom')}
                  aria-pressed={dockPosition === 'bottom'}
                  aria-label={getDockOptionTitle('bottom')}
                  title={getDockOptionTitle('bottom')}
                  data-dock-option="bottom"
                >
                  <ArrowDownToLine size={13} strokeWidth={2.1} />
                </button>
              </div>
            </div>
            <div class="panel-actions" role="group" aria-label="Panel actions">
              {#if canOpenTargetModal && onOpenTargetModal}
                <button
                  type="button"
                  class="header-icon-button"
                  onclick={() => onOpenTargetModal?.()}
                  aria-label="Open target selector"
                  title="Open target selector"
                >
                  <Crosshair size={14} strokeWidth={2.1} />
                </button>
              {/if}
              <button
                type="button"
                class="header-icon-button"
                onclick={toggleViewMode}
                aria-label={viewMode === 'normal'
                  ? 'Switch to compact view'
                  : 'Switch to full view'}
                title={viewMode === 'normal' ? 'Compact view' : 'Full view'}
              >
                {#if viewMode === 'normal'}
                  <Shrink size={14} strokeWidth={2.1} />
                {:else}
                  <Expand size={14} strokeWidth={2.1} />
                {/if}
              </button>
              <button
                type="button"
                class="header-icon-button"
                onclick={minimizePanel}
                aria-label="Minimize pending effects"
                title="Minimize"
              >
                <ChevronDown size={14} strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </div>

        <div class="item-list">
          {#each displaySections() as section (section.key)}
            {#if section.label}
              <div class="section-header section-header--{section.key}">
                <span class="section-header__label">{section.label}</span>
                <span class="section-header__count">{section.items.length}</span
                >
              </div>
            {/if}
            {#each section.items as item (item.id)}
              <article
                class="effect-card"
                class:effect-card--active={item.isActive === true}
                class:effect-card--local={item.isLocalPlayer === true}
                class:effect-card--opponent={item.isLocalPlayer === false}
                onmouseenter={() => handleCardPreviewEnter(item.card)}
                onmouseleave={() => handleCardPreviewLeave(item.card)}
                onfocusin={() => handleCardPreviewEnter(item.card)}
                onfocusout={() => handleCardPreviewLeave(item.card)}
              >
                <div class="effect-card__media">
                  {#if item.card?.set && item.card.cardNumber}
                    <button
                      type="button"
                      class="card-frame card-frame-button"
                      onclick={() => handleOpenGlobalPreview(item.card)}
                      aria-label={`Open full card preview for ${item.title}`}
                      title="Open full card preview"
                    >
                      <CardImage
                        set={item.card.set}
                        number={item.card.cardNumber}
                        crop="art_only"
                        alt={item.title}
                      />
                      <span class="card-preview-handle" aria-hidden="true">
                        <Expand size={12} strokeWidth={2.1} />
                      </span>
                    </button>
                  {/if}
                </div>

                <div class="effect-card__body">
                  <h3>{item.title}</h3>
                  {#if viewMode === 'compact' && item.secondaryTitle}
                    <p class="effect-secondary-title">{item.secondaryTitle}</p>
                  {/if}
                  {#if showCompactMeta()}
                    <!-- <p class="effect-subtitle">{item.subtitle}</p> -->
                    {#if item.instanceReferences && item.instanceReferences.length > 0}
                      <div class="effect-reference-list">
                        {#each item.instanceReferences as reference (reference.id)}
                          <span class="effect-reference-row">
                            <span class="effect-reference-kind"
                              >{reference.label}:</span
                            >
                            <CardLogToken
                              cardId={reference.cardId}
                              fallbackLabel={reference.card?.label ??
                                reference.cardId}
                              fallbackInkType={reference.card?.inkType}
                            />
                          </span>
                        {/each}
                      </div>
                    {/if}
                    {#if item.card?.text}
                      <p class="effect-rules">{item.card.text}</p>
                    {/if}

                    {#if item.disabledReason}
                      <p class="effect-disabled-reason">
                        {item.disabledReason}
                      </p>
                    {/if}
                  {:else if shouldShowCompactDisabledReason(item)}
                    <p
                      class="effect-disabled-reason effect-disabled-reason--compact"
                    >
                      {item.disabledReason}
                    </p>
                  {/if}

                  {#if item.namedCardSearch}
                    <div class="effect-named-card-search">
                      <NamedCardSearchInput
                        query={item.namedCardSearch.query}
                        results={item.namedCardSearch.results}
                        oninput={item.namedCardSearch.oninput}
                        onselect={item.namedCardSearch.onselect}
                        compact
                      />
                    </div>
                  {/if}
                </div>

                <div
                  class="effect-actions"
                  data-action-count={item.isLocalPlayer === false
                    ? 0
                    : getActionButtonCount(item)}
                >
                  {#if item.isLocalPlayer === false}
                    <span class="effect-waiting">Waiting for opponent</span>
                  {:else if item.statusMessage}
                    {#if item.inlineActions && item.inlineActions.length > 0}
                      {#each item.inlineActions as action (action.id)}
                        <button
                          type="button"
                          class={`action-button ${action.emphasis ? 'action-button--primary' : 'action-button--secondary'}`}
                          onclick={action.onClick}
                          disabled={action.disabled}
                        >
                          {action.label}
                        </button>
                      {/each}
                    {/if}
                    {#if item.onConfirm}
                      <button
                        type="button"
                        class="action-button action-button--primary"
                        onclick={() => item.onConfirm?.()}
                      >
                        Confirm
                      </button>
                    {/if}
                    {#if item.onCancel}
                      <button
                        type="button"
                        class="action-button action-button--secondary"
                        onclick={() => item.onCancel?.()}
                      >
                        Cancel
                      </button>
                    {/if}
                  {:else}
                    {#if item.onPrimaryAction}
                      <button
                        type="button"
                        class="action-button action-button--primary"
                        onclick={() => handlePrimaryAction(item)}
                      >
                        {item.primaryActionLabel ?? 'Open'}
                      </button>
                    {/if}
                    {#if item.canResolve && item.onResolve}
                      <button
                        type="button"
                        class="action-button action-button--primary"
                        onclick={() => handleResolve(item)}
                      >
                        Resolve
                      </button>
                    {/if}
                    {#if item.canAccept && item.onAccept}
                      <button
                        type="button"
                        class="action-button action-button--primary"
                        onclick={() => handleAccept(item)}
                      >
                        Accept
                      </button>
                    {/if}
                    {#if item.canReject && item.onReject}
                      <button
                        type="button"
                        class="action-button action-button--secondary"
                        onclick={() => handleReject(item)}
                      >
                        Reject
                      </button>
                    {/if}
                  {/if}
                </div>
              </article>
            {/each}
          {/each}
        </div>
      </section>
    </div>
  {/if}
{/if}

<style>
  .pending-effects-reminder {
    position: absolute;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    right: 1rem;
    z-index: 500;
    cursor: grab;
    touch-action: none;
    user-select: none;
    min-width: 11.5rem;
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.15rem 0.7rem;
    align-items: center;
    padding: 0.78rem 1.8rem 0.78rem 0.92rem;
    border-radius: 1rem;
    border: 1px solid rgba(248, 196, 113, 0.42);
    background: linear-gradient(
        135deg,
        rgba(72, 42, 12, 0.96),
        rgba(22, 17, 10, 0.94)
      ),
      radial-gradient(
        circle at top left,
        rgba(245, 184, 73, 0.28),
        transparent 55%
      );
    box-shadow:
      0 16px 36px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 237, 195, 0.18);
    color: #fff3d6;
    text-align: left;
  }

  .trigger-label {
    font-size: 0.74rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 227, 176, 0.84);
  }

  .trigger-count {
    justify-self: end;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
  }

  .trigger-toggle-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 239, 208, 0.92);
  }

  .trigger-breakdown {
    grid-column: 1 / -1;
    font-size: 0.78rem;
    color: rgba(255, 236, 203, 0.76);
  }

  .trigger-current-list {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    max-height: 7rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(248, 196, 113, 0.35) transparent;
  }

  .trigger-current {
    color: rgba(255, 244, 220, 0.92);
    font-size: 0.74rem;
    font-weight: 600;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .trigger-count-badge {
    display: inline-block;
    margin-right: 0.25rem;
    color: rgba(248, 196, 113, 0.9);
    font-weight: 800;
  }

  .pending-effects-reminder--dragging {
    cursor: grabbing;
  }

  .pending-effects-panel-anchor {
    position: absolute;
    right: 1rem;
    z-index: 30;
    pointer-events: none;
  }

  .pending-effects-panel-anchor[data-dock-position='middle'] {
    top: 50%;
  }

  .pending-effects-panel-anchor[data-dock-position='top'] {
    top: calc(6.4rem + env(safe-area-inset-top));
  }

  .pending-effects-panel-anchor[data-dock-position='bottom'] {
    bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .pending-effects-panel {
    pointer-events: auto;
    width: min(28rem, calc(100vw - 2.25rem));
    max-height: min(72vh, 42rem);
    overflow: auto;
    padding: 1rem;
    border-radius: 1.1rem;
    border: 1px solid rgba(138, 175, 214, 0.26);
    background: linear-gradient(
        180deg,
        rgba(8, 17, 28, 0.98),
        rgba(5, 11, 20, 0.97)
      ),
      radial-gradient(circle at top, rgba(98, 184, 255, 0.14), transparent 46%);
    box-shadow:
      0 28px 65px rgba(0, 0, 0, 0.48),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(14px);
  }

  .pending-effects-panel[data-dock-position='middle'] {
    transform: translateY(-50%);
  }

  .pending-effects-panel--compact {
    width: min(19rem, calc(100vw - 1.5rem));
    padding: 0.72rem;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    gap: 0.65rem;
    align-items: center;
    margin-bottom: 0.7rem;
  }

  .panel-title-block {
    display: flex;
    gap: 0.7rem;
    align-items: center;
    min-width: 0;
    flex: 1;
  }

  .panel-title-copy {
    display: grid;
    gap: 0.14rem;
    min-width: 0;
  }

  .panel-title {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #f8fbff;
  }

  .panel-subtitle {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1.2;
    color: rgba(180, 206, 234, 0.76);
  }

  .panel-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.45rem;
    height: 1.45rem;
    padding: 0 0.38rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 187, 242, 0.28);
    background: rgba(17, 34, 54, 0.78);
    color: #dce9f8;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
  }

  .panel-controls {
    display: flex;
    gap: 0.22rem;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  .panel-placement-control {
    display: inline-flex;
    align-items: center;
    gap: 0.18rem;
    min-height: 1.45rem;
    padding: 0.08rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 163, 205, 0.16);
    background: rgba(11, 21, 35, 0.66);
  }

  .panel-placement-label {
    font-size: 0.62rem;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(180, 206, 234, 0.72);
  }

  .panel-placement-options,
  .panel-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.18rem;
  }

  .panel-actions {
    padding: 0.08rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 163, 205, 0.16);
    background: rgba(11, 21, 35, 0.52);
  }

  .header-chip-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2rem;
    border-radius: 999px;
    border: 1px solid rgba(125, 163, 205, 0.24);
    background: rgba(16, 29, 47, 0.76);
    color: #dce9f8;
    padding: 0.34rem 0.72rem;
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition:
      border-color 150ms ease,
      background 150ms ease,
      transform 150ms ease,
      opacity 150ms ease;
  }

  .header-chip-button--active,
  .header-icon-button--active {
    border-color: rgba(168, 206, 245, 0.44);
    background: rgba(28, 55, 86, 0.94);
    color: #f3f8ff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .header-icon-button--placement {
    width: 1.45rem;
    height: 1.45rem;
    border-radius: 999px;
  }

  .header-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.45rem;
    height: 1.45rem;
    border: 1px solid rgba(125, 163, 205, 0.24);
    background: rgba(16, 29, 47, 0.76);
    color: #dce9f8;
    border-radius: 999px;
    padding: 0;
    transition:
      border-color 150ms ease,
      background 150ms ease,
      transform 150ms ease;
  }

  .header-chip-button:hover,
  .header-chip-button:focus-visible,
  .header-icon-button:hover,
  .header-icon-button:focus-visible {
    border-color: rgba(153, 191, 232, 0.44);
    background: rgba(22, 39, 62, 0.92);
    transform: translateY(-1px);
    outline: none;
  }

  .header-chip-button:disabled {
    opacity: 0.5;
    transform: none;
  }

  .item-list {
    display: grid;
    gap: 0.8rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.35rem 0.65rem;
    border-radius: 0.5rem;
    margin-bottom: -0.2rem;
  }

  .section-header--you {
    background: rgba(25, 78, 52, 0.35);
    border: 1px solid rgba(94, 214, 162, 0.2);
  }

  .section-header--opp {
    background: rgba(90, 25, 25, 0.35);
    border: 1px solid rgba(246, 110, 110, 0.2);
  }

  .section-header--unknown {
    background: rgba(30, 46, 66, 0.4);
    border: 1px solid rgba(122, 159, 202, 0.18);
  }

  .section-header__label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    flex: 1;
  }

  .section-header--you .section-header__label {
    color: rgba(134, 239, 172, 0.85);
  }

  .section-header--opp .section-header__label {
    color: rgba(252, 165, 165, 0.85);
  }

  .section-header--unknown .section-header__label {
    color: rgba(180, 206, 234, 0.65);
  }

  .section-header__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.35rem;
    height: 1.35rem;
    padding: 0 0.3rem;
    border-radius: 999px;
    font-size: 0.66rem;
    font-weight: 700;
  }

  .section-header--you .section-header__count {
    background: rgba(30, 90, 55, 0.65);
    color: rgba(134, 239, 172, 0.9);
  }

  .section-header--opp .section-header__count {
    background: rgba(90, 25, 25, 0.65);
    color: rgba(252, 165, 165, 0.9);
  }

  .section-header--unknown .section-header__count {
    background: rgba(20, 40, 65, 0.65);
    color: rgba(180, 206, 234, 0.8);
  }

  .effect-waiting {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(252, 165, 165, 0.7);
    text-align: center;
    line-height: 1.3;
    font-style: italic;
  }

  .effect-card {
    display: grid;
    grid-template-columns: 4.5rem minmax(0, 1fr);
    align-items: start;
    gap: 0.9rem;
    padding: 0.85rem;
    border-radius: 1rem;
    border: 1px solid rgba(122, 159, 202, 0.18);
    background: linear-gradient(
        180deg,
        rgba(11, 24, 39, 0.86),
        rgba(8, 17, 28, 0.86)
      ),
      radial-gradient(
        circle at top right,
        rgba(94, 234, 212, 0.08),
        transparent 38%
      );
  }

  .effect-card--active {
    border-color: rgba(244, 194, 96, 0.46);
    box-shadow:
      0 0 0 1px rgba(244, 194, 96, 0.12),
      inset 0 1px 0 rgba(255, 229, 181, 0.08);
  }

  .effect-card--local {
    border-left: 3px solid rgba(94, 214, 162, 0.65);
  }

  .effect-card--opponent {
    border-left: 3px solid rgba(246, 110, 110, 0.55);
    opacity: 0.78;
  }

  .effect-owner {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .effect-owner--you {
    background: rgba(25, 78, 52, 0.6);
    color: rgba(134, 239, 172, 0.92);
  }

  .effect-owner--opp {
    background: rgba(90, 25, 25, 0.6);
    color: rgba(252, 165, 165, 0.92);
  }

  .effect-card__media {
    inline-size: 4.5rem;
    block-size: 3.6907rem;
  }

  .card-frame {
    width: 100%;
    height: 100%;
    border-radius: 0.85rem;
    overflow: hidden;
    background: rgba(20, 35, 55, 0.85);
    border: 1px solid rgba(132, 170, 214, 0.18);
  }

  .card-frame-button {
    position: relative;
    display: block;
    padding: 0;
    cursor: pointer;
    transition:
      border-color 140ms ease,
      transform 140ms ease,
      box-shadow 140ms ease;
  }

  .card-frame-button:hover,
  .card-frame-button:focus-visible {
    border-color: rgba(190, 218, 247, 0.44);
    transform: translateY(-1px);
    box-shadow:
      0 0 0 1px rgba(190, 218, 247, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    outline: none;
  }

  .card-frame--placeholder {
    display: grid;
    place-items: center;
    color: rgba(214, 230, 250, 0.72);
    font-size: 0.82rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .card-frame :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-preview-handle {
    position: absolute;
    right: 0.28rem;
    bottom: 0.28rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 999px;
    border: 1px solid rgba(188, 216, 245, 0.38);
    background: rgba(9, 19, 31, 0.82);
    color: #eef6ff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.28);
  }

  .effect-card__body {
    min-width: 0;
  }

  .effect-card__header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
    margin-bottom: 0.35rem;
  }

  .effect-badge,
  .effect-state {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .effect-badge {
    background: rgba(56, 84, 116, 0.52);
    color: rgba(219, 234, 254, 0.9);
  }

  .effect-state {
    background: rgba(102, 72, 18, 0.56);
    color: #ffd88d;
  }

  .effect-card h3 {
    margin: 0;
    font-size: 0.98rem;
    line-height: 1.2;
    color: #f8fbff;
  }

  .effect-subtitle,
  .effect-detail,
  .effect-rules,
  .effect-disabled-reason {
    margin: 0;
  }

  .effect-subtitle {
    margin-top: 0.32rem;
    color: rgba(215, 231, 248, 0.82);
    font-size: 0.74rem;
    font-weight: 600;
  }

  .effect-secondary-title {
    margin-top: 0.18rem;
    color: rgba(180, 206, 234, 0.88);
    font-size: 0.72rem;
    line-height: 1.2;
    font-weight: 600;
  }

  .effect-reference-list {
    display: grid;
    gap: 0.24rem;
    margin-top: 0.4rem;
  }

  .effect-reference-row {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
    font-size: 0.72rem;
    line-height: 1.25;
  }

  .effect-reference-kind {
    color: rgba(148, 193, 242, 0.84);
    font-weight: 700;
  }

  .effect-detail {
    margin-top: 0.25rem;
    color: rgba(180, 206, 234, 0.78);
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .effect-rules {
    margin-top: 0.55rem;
    font-size: 0.78rem;
    line-height: 1.5;
    color: rgba(180, 206, 234, 0.8);
    white-space: pre-wrap;
  }

  .effect-disabled-reason {
    margin-top: 0.48rem;
    color: rgba(246, 182, 182, 0.82);
    font-size: 0.72rem;
    line-height: 1.35;
  }

  .effect-named-card-search {
    margin-top: 0.45rem;
  }

  .effect-actions {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    gap: 0.55rem;
    min-width: 0;
    margin-top: 0.18rem;
  }

  .effect-status-message {
    font-size: 0.76rem;
    color: rgba(248, 196, 113, 0.92);
    font-weight: 600;
    text-align: center;
    line-height: 1.3;
  }

  .effect-status-message--compact {
    margin-top: 0.35rem;
    text-align: left;
    font-size: 0.71rem;
    line-height: 1.25;
  }

  .effect-disabled-reason--compact {
    margin-top: 0.3rem;
    font-size: 0.68rem;
    line-height: 1.25;
  }

  .action-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 2.35rem;
    border-radius: 999px;
    padding: 0.52rem 0.88rem;
    font-size: 0.8rem;
    font-weight: 600;
    transition:
      transform 140ms ease,
      border-color 140ms ease,
      background 140ms ease;
  }

  .action-button:hover,
  .action-button:focus-visible {
    transform: translateY(-1px);
    outline: none;
  }

  .action-button--primary {
    border: 1px solid rgba(247, 197, 110, 0.46);
    background: linear-gradient(
        180deg,
        rgba(129, 78, 18, 0.96),
        rgba(92, 55, 12, 0.94)
      ),
      radial-gradient(circle at top, rgba(245, 184, 73, 0.22), transparent 54%);
    color: #fff4dd;
  }

  .action-button--primary:hover,
  .action-button--primary:focus-visible {
    border-color: rgba(247, 197, 110, 0.74);
  }

  .action-button--secondary {
    border: 1px solid rgba(125, 163, 205, 0.26);
    background: rgba(16, 29, 47, 0.84);
    color: #dce9f8;
  }

  .action-button--secondary:hover,
  .action-button--secondary:focus-visible {
    border-color: rgba(153, 191, 232, 0.44);
    background: rgba(22, 39, 62, 0.92);
  }

  .pending-effects-panel--compact .item-list {
    gap: 0.45rem;
  }

  .pending-effects-panel--compact .effect-card {
    grid-template-columns: 3.05rem minmax(0, 1fr);
    gap: 0.55rem;
    padding: 0.56rem;
    border-radius: 0.82rem;
  }

  .pending-effects-panel--compact .effect-card__media {
    inline-size: 3.05rem;
    block-size: 2.5rem;
  }

  .pending-effects-panel--compact .card-frame {
    border-radius: 0.68rem;
  }

  .pending-effects-panel--compact .card-preview-handle {
    right: 0.22rem;
    bottom: 0.22rem;
    width: 1.05rem;
    height: 1.05rem;
  }

  .pending-effects-panel--compact .effect-actions {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
    gap: 0.45rem;
    margin-top: 0.18rem;
  }

  .pending-effects-panel--compact .effect-actions[data-action-count='1'] {
    grid-template-columns: minmax(0, 1fr);
  }

  .pending-effects-panel--compact .effect-card h3 {
    font-size: 0.88rem;
    line-height: 1.15;
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .pending-effects-panel--compact .effect-card__body {
    align-self: center;
  }

  .pending-effects-panel--compact .effect-secondary-title {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .pending-effects-panel--compact .panel-title {
    font-size: 0.84rem;
  }

  .pending-effects-panel--compact .panel-subtitle {
    font-size: 0.64rem;
  }

  .pending-effects-panel--compact .action-button {
    min-height: 2.2rem;
    padding: 0.46rem 0.7rem;
    font-size: 0.76rem;
  }

  @media (max-width: 767px) {
    .pending-effects-reminder {
      top: calc(0.7rem + env(safe-area-inset-top));
      bottom: auto;
      right: 0.7rem;
      min-width: 10.5rem;
      padding: 0.72rem 0.82rem;
    }

    .pending-effects-panel-anchor {
      right: 0.5rem;
    }

    .pending-effects-panel-anchor[data-dock-position='top'] {
      top: calc(4.95rem + env(safe-area-inset-top));
    }

    .pending-effects-panel-anchor[data-dock-position='bottom'] {
      bottom: calc(6.25rem + env(safe-area-inset-bottom));
    }

    .pending-effects-panel {
      width: min(23rem, calc(100vw - 1rem));
      max-height: min(68vh, 32rem);
      padding: 0.86rem;
    }

    .pending-effects-panel--compact {
      width: min(17.5rem, calc(100vw - 0.75rem));
      padding: 0.62rem;
    }

    .effect-card {
      grid-template-columns: 3.65rem minmax(0, 1fr);
      gap: 0.72rem;
    }

    .panel-header {
      margin-bottom: 0.58rem;
    }

    .panel-title-block {
      gap: 0.5rem;
    }

    .panel-controls {
      justify-content: flex-end;
      gap: 0.18rem;
    }

    .panel-title {
      font-size: 0.84rem;
    }

    .panel-subtitle {
      font-size: 0.64rem;
    }

    .header-chip-button,
    .header-icon-button {
      width: 1.45rem;
      height: 1.45rem;
    }

    .panel-placement-control {
      gap: 0.14rem;
      min-height: 1.45rem;
      padding: 0.06rem;
    }

    .header-chip-button {
      min-height: 1.85rem;
      width: auto;
      padding: 0.3rem 0.58rem;
      font-size: 0.62rem;
    }

    .header-icon-button--placement {
      width: 1.45rem;
      height: 1.45rem;
    }

    .effect-card__media {
      inline-size: 3.65rem;
      block-size: 2.995rem;
    }

    .effect-actions {
      grid-column: 1 / -1;
      grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
      min-width: 0;
    }

    .pending-effects-panel--compact .effect-card {
      grid-template-columns: 2.85rem minmax(0, 1fr);
      gap: 0.48rem;
      padding: 0.5rem;
    }

    .pending-effects-panel--compact .effect-card__media {
      inline-size: 2.85rem;
      block-size: 2.34rem;
    }
  }
</style>
