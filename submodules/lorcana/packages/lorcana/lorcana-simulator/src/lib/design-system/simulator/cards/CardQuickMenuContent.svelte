<script lang="ts">
  import type { Snippet } from "svelte";
  import { createHotkeys, type RegisterableHotkey } from "@tanstack/svelte-hotkeys";
  import type {
    CardActionView,
    ExecutableMoveEntry,
    LorcanaCardSnapshot,
  } from "@/features/simulator/model/contracts.js";
  import {
    getInkSymbolUrl,
    getInkableIconUrl,
  } from "@/features/simulator/model/asset-urls.js";
  import { getCardActionCategoryIcon } from "@/features/simulator/model/action-icons.js";
  import { getFormattedHotkeyParts } from "@/features/simulator/hotkeys/hotkey-bindings.js";
  import { m } from "$lib/i18n/messages.js";
  import { SYMBOL_BASE_URL, tokenizeTextWithSymbols } from "./symbol-tokenizer.js";
  import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";

  interface CardQuickMenuContentProps {
    card: LorcanaCardSnapshot;
    actions?: CardActionView[];
    contextMessage?: string | null;
    onAction?: (action: CardActionView) => void;
    onSwitchToDetailed?: () => void;
    headerActions?: Snippet;
  }

  let {
    card,
    actions = [],
    contextMessage = null,
    onAction,
    onSwitchToDetailed,
    headerActions,
  }: CardQuickMenuContentProps = $props();

  interface QuickActionRow {
    key: string;
    action: CardActionView;
    label: string;
    detail?: string;
    hotkey: string | null;
  }

  function normalizeAbilityMatchKey(value: string | undefined): string {
    return (value ?? "")
      .toLowerCase()
      .replace(/\{[^}]+\}/g, "")
      .replace(/[^a-z0-9]+/g, "");
  }

  function getAbilityTitleMatchKeys(title: string): string[] {
    const normalized = normalizeAbilityMatchKey(title);
    if (!normalized) {
      return [];
    }

    const withoutTrailingDigits = normalized.replace(/\d+$/g, "");
    return withoutTrailingDigits && withoutTrailingDigits !== normalized
      ? [normalized, withoutTrailingDigits]
      : [normalized];
  }

  function getAbilityEntry(
    move: ExecutableMoveEntry,
  ): { title?: string; description?: string } | null {
    if (move.moveId !== "activateAbility") return null;
    const moveMatchKey = normalizeAbilityMatchKey(move.label);
    const matchedEntry = card.textEntries?.find((entry) =>
      getAbilityTitleMatchKeys(entry.title).some((key) => moveMatchKey.includes(key)),
    );
    if (matchedEntry) {
      return { title: matchedEntry.title, description: matchedEntry.description };
    }

    const idx = (move.params as { abilityIndex?: unknown }).abilityIndex;
    const safeIdx = typeof idx === "number" ? idx : 0;
    const entry = card.textEntries?.[safeIdx];
    return entry ? { title: entry.title, description: entry.description } : null;
  }

  // Build one row per visible action, with one nuance: activate-ability
  // groups all of a card's activated abilities into a single CardActionView,
  // so we expand that into one row per ability (using each move's own label)
  // — otherwise the menu just shows a generic "Activate Ability" entry.
  //
  // Hotkeys: enabled rows are numbered 1-9 sequentially in render order. The
  // first nine enabled actions claim digits in the order they appear, so a
  // card with two activated abilities gets 1 and 2 for those, 3 for Play,
  // etc. — a layer-local mapping that fits inside the action-menu layer.
  const SEQUENTIAL_QUICK_MENU_HOTKEYS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ] as const;
  const rows = $derived.by<QuickActionRow[]>(() => {
    const expanded: QuickActionRow[] = [];
    let nextHotkeyIndex = 0;
    const claimHotkey = (action: CardActionView): string | null => {
      if (!action.enabled) return null;
      const hotkey = SEQUENTIAL_QUICK_MENU_HOTKEYS[nextHotkeyIndex];
      if (!hotkey) return null;
      nextHotkeyIndex += 1;
      return hotkey;
    };

    for (const action of actions) {
      if (action.categoryId === "activate-ability") {
        const moves = action.moves;
        if (moves.length > 1) {
          for (const move of moves) {
            const entry = getAbilityEntry(move);
            const expandedAction = { ...action, moves: [move] };
            expanded.push({
              key: move.id,
              action: expandedAction,
              label: entry?.title?.trim() || action.label,
              detail: entry?.description?.trim() || action.detail,
              hotkey: claimHotkey(expandedAction),
            });
          }
          continue;
        }

        const move = moves[0];
        const entry = move ? getAbilityEntry(move) : null;
        expanded.push({
          key: action.id,
          action,
          label: entry?.title?.trim() || action.label,
          detail: entry?.description?.trim() || action.detail,
          hotkey: claimHotkey(action),
        });
        continue;
      }

      expanded.push({
        key: action.id,
        action,
        label: action.label,
        detail: action.detail,
        hotkey: claimHotkey(action),
      });
    }

    return expanded;
  });

  function trigger(action: CardActionView): void {
    if (!action.enabled) return;
    onAction?.(action);
  }

  const manualMode = getManualModeContext();
  const manualModeEnabled = $derived(manualMode?.enabled ?? false);
  const manualMoveTargets = $derived.by(() => {
    const currentZone = card.zoneId.split(":")[0] ?? "";
    return (
      [
        { zone: "hand", label: "Hand" },
        { zone: "play", label: "Play" },
        { zone: "inkwell", label: "Inkwell" },
        { zone: "discard", label: "Discard" },
        { zone: "deck", label: "Deck (top)", position: "top" as const },
        { zone: "deck", label: "Deck (bottom)", position: "bottom" as const },
      ] as Array<{ zone: string; label: string; position?: "top" | "bottom" }>
    ).filter((target) => !(target.zone === currentZone && target.position === undefined));
  });

  function handleManualMove(zone: string, position?: "top" | "bottom"): void {
    if (!manualMode) return;
    manualMode.moveCard(card.cardId, `${zone}:${card.ownerId}`, position);
  }

  createHotkeys(
    () =>
      rows
        .filter((row): row is QuickActionRow & { hotkey: string } => row.hotkey !== null)
        .map((row) => ({
          hotkey: row.hotkey as RegisterableHotkey,
          callback: () => trigger(row.action),
          options: { enabled: row.action.enabled },
        })),
    { ignoreInputs: true, preventDefault: true, stopPropagation: true },
  );
</script>

<div
  class="flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur"
  data-testid="card-quick-menu"
>
  <header class="flex items-start gap-2 border-b border-white/10 px-3 py-2">
    <div class="relative flex size-8 shrink-0 items-center justify-center">
      <img src={getInkableIconUrl(card.inkable)} alt="" class="absolute inset-0 size-full" />
      <span class="relative text-sm font-bold text-white drop-shadow">
        {card.playCost ?? card.cost ?? 0}
      </span>
    </div>
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-sm font-semibold leading-tight">
        {#if card.label.includes(" - ")}
          {@const [name, version] = card.label.split(" - ")}
          {name}<span class="text-slate-400"> — {version}</span>
        {:else}
          {card.label}
        {/if}
      </span>
      {#if card.inkType && card.inkType.length > 0}
        <div class="mt-0.5 flex items-center gap-1">
          {#each card.inkType as ink (ink)}
            <img src={getInkSymbolUrl(ink)} alt={ink} class="size-3" />
          {/each}
        </div>
      {/if}
    </div>
    {#if headerActions}
      <div class="flex items-center gap-1">
        {@render headerActions()}
      </div>
    {/if}
  </header>

  {#if contextMessage}
    <p class="px-3 py-1.5 text-xs text-slate-400">{contextMessage}</p>
  {/if}

  <ul class="flex flex-col py-1" role="menu">
    {#if rows.length === 0}
      <li class="px-3 py-3 text-xs text-slate-500" role="none">
        {m["cardInfo.noActions"]({})}
      </li>
    {:else}
      {#each rows as row (row.key)}
        {@const ActionIcon = getCardActionCategoryIcon(row.action.categoryId)}
        <li role="none">
          <button
            type="button"
            role="menuitem"
            disabled={!row.action.enabled}
            class="flex w-full items-center gap-2 px-3 py-3 text-left text-sm transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onclick={() => trigger(row.action)}
            data-testid={`card-quick-menu-action-${row.action.categoryId}-${row.key}`}
            aria-label={row.detail ? `${row.label}: ${row.detail}` : row.label}
            title={row.action.reason ?? row.detail ?? row.label}
          >
            <span class="flex size-5 shrink-0 items-center justify-center text-slate-300">
              <ActionIcon class="size-4" />
            </span>
            <span class="flex min-w-0 flex-1 flex-col gap-0.5">
              <span class="truncate font-medium">
                {#each tokenizeTextWithSymbols(row.label) as token, i (i)}
                  {#if token.type === "symbol"}
                    <img
                      src={`${SYMBOL_BASE_URL}/${token.file}`}
                      alt={token.code}
                      class="inline-symbol"
                    />
                  {:else}
                    {token.value}
                  {/if}
                {/each}
              </span>
              {#if row.detail}
                <span class="text-xs leading-snug text-slate-400">
                  {#each tokenizeTextWithSymbols(row.detail) as token, i (i)}
                    {#if token.type === "symbol"}
                      <img
                        src={`${SYMBOL_BASE_URL}/${token.file}`}
                        alt={token.code}
                        class="inline-symbol"
                      />
                    {:else}
                      {token.value}
                    {/if}
                  {/each}
                </span>
              {/if}
              {#if !row.action.enabled && row.action.reason}
                <span class="text-xs leading-snug text-amber-300/80">{row.action.reason}</span>
              {/if}
            </span>
            {#if row.hotkey}
              <kbd class="ml-auto flex shrink-0 items-center gap-0.5 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-slate-300">
                {#each getFormattedHotkeyParts(row.hotkey) as part (part)}
                  <span>{part}</span>
                {/each}
              </kbd>
            {/if}
          </button>
        </li>
      {/each}
    {/if}
  </ul>

  {#if manualModeEnabled}
    <div class="border-t border-white/10 px-3 py-2">
      <div class="mb-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Manual: Move to…</div>
      <div class="flex flex-wrap gap-1.5">
        {#each manualMoveTargets as target (target.zone + (target.position ?? ""))}
          <button
            type="button"
            class="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-100 transition-colors hover:bg-white/15"
            onclick={() => handleManualMove(target.zone, target.position)}
            data-testid={`card-quick-menu-manual-move-${target.zone}${target.position ? `-${target.position}` : ""}`}
          >
            {target.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if onSwitchToDetailed}
    <button
      type="button"
      class="flex w-full items-center justify-center gap-2 border-t border-white/10 px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
      onclick={onSwitchToDetailed}
      data-testid="card-quick-menu-switch-detailed"
    >
      {m["cardInfo.switchToDetailed"]({})}
    </button>
  {/if}
</div>

<style>
  .inline-symbol {
    display: inline-block;
    width: 0.9em;
    height: 0.9em;
    margin: 0 0.08em;
    vertical-align: -0.15em;
    object-fit: contain;
    /* The shared symbol SVGs are authored for the cream card body; brighten
       them so they read on the dark Quick-menu surface. */
    filter: brightness(0) invert(1);
  }
</style>
