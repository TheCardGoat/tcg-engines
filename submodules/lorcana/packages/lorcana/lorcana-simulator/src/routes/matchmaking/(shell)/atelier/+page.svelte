<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    fetchAtelierBalance,
    fetchAtelierHoldings,
    fetchAtelierLedger,
    fetchAtelierPromotions,
    sellBackAtelierHolding,
    type AtelierBalance,
    type AtelierHolding,
    type AtelierLedgerEntry,
    type AtelierPromotion,
  } from "$lib/features/atelier/api/atelier-api.js";

  const PAGE_TITLE = "Atelier - Lorcana Simulator";
  const GAME_SLUG = "lorcana";

  let balance = $state<AtelierBalance | null>(null);
  let holdings = $state<AtelierHolding[]>([]);
  let ledger = $state<AtelierLedgerEntry[]>([]);
  let nextLedgerCursor = $state<string | null>(null);
  let promotions = $state<AtelierPromotion[]>([]);
  let activeTab = $state<"holdings" | "ledger" | "promotions">("holdings");
  let loading = $state(false);
  let actionMessage = $state<{ kind: "ok" | "error"; text: string } | null>(null);

  async function refreshAll() {
    loading = true;
    try {
      const [b, h, l, p] = await Promise.all([
        fetchAtelierBalance(GAME_SLUG),
        fetchAtelierHoldings(false),
        fetchAtelierLedger({ limit: 50 }),
        fetchAtelierPromotions(GAME_SLUG),
      ]);
      balance = b;
      holdings = h.holdings;
      ledger = l.entries;
      nextLedgerCursor = l.nextCursor;
      promotions = p.promotions;
    } finally {
      loading = false;
    }
  }

  async function loadMoreLedger() {
    if (!nextLedgerCursor) return;
    const more = await fetchAtelierLedger({ cursor: nextLedgerCursor, limit: 50 });
    ledger = [...ledger, ...more.entries];
    nextLedgerCursor = more.nextCursor;
  }

  async function handleSellBack(holding: AtelierHolding) {
    actionMessage = null;
    try {
      const result = await sellBackAtelierHolding(holding.id);
      actionMessage = {
        kind: "ok",
        text: `Sold back · refund ${result.refundMarks} Inkmarks`,
      };
      await refreshAll();
    } catch (err) {
      actionMessage = {
        kind: "error",
        text: err instanceof Error ? err.message : "Sell-back failed",
      };
    }
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatReason(entry: AtelierLedgerEntry): string {
    const reason = entry.reason ?? "";
    if (reason === "patron_thanks") return "Patron Thanks Grant";
    if (reason === "sell_back") return "Sell-back refund";
    if (reason === "purchase_rental") return "Rental purchase";
    if (reason === "purchase_permanent") return "Permanent unlock";
    if (reason === "bug_report_accepted") return "Bug report accepted";
    if (reason === "suggestion_accepted") return "Suggestion accepted";
    if (reason.startsWith("engagement_event:")) return "Match earnings";
    if (entry.entryType === "adjustment") return "Admin adjustment";
    return reason || "Wallet entry";
  }

  function entryAmountSign(entry: AtelierLedgerEntry): string {
    if (entry.entryType === "debit") return "−";
    return "+";
  }

  onMount(() => {
    void refreshAll();
  });

  const dailyCap = $derived(balance?.dailyCapPoints ?? 0);
  const earnedToday = $derived(balance?.earnedToday ?? 0);
  const dailyProgress = $derived(
    dailyCap > 0 ? Math.min(100, Math.round((earnedToday / dailyCap) * 100)) : 0,
  );
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8 min-h-0 flex-1 overflow-y-auto pb-12">
  <header class="mt-2 flex items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-foreground">Atelier</h1>
      <p class="text-sm text-muted-foreground">
        Curate the look of your decks. Earn Inkmarks every match — spend them on alternate arts.
      </p>
    </div>
    <button
      type="button"
      class="text-sm text-muted-foreground underline-offset-2 hover:underline"
      onclick={() => goto("/matchmaking")}
    >
      Back to lobby
    </button>
  </header>

  <section class="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <div>
        <div class="text-xs uppercase tracking-wide text-muted-foreground">Balance</div>
        <div class="text-3xl font-semibold text-foreground">
          {balance?.marks ?? "—"}
          <span class="text-sm font-normal text-muted-foreground">Inkmarks</span>
        </div>
      </div>
      <div>
        <div class="text-xs uppercase tracking-wide text-muted-foreground">Today</div>
        <div class="text-lg font-medium">
          {earnedToday} / {dailyCap || "∞"}
        </div>
      </div>
      <div>
        <div class="text-xs uppercase tracking-wide text-muted-foreground">This week</div>
        <div class="text-lg font-medium">
          {balance?.earnedThisWeek ?? 0} / {balance?.weeklyCapPoints ?? "∞"}
        </div>
      </div>
    </div>
    {#if dailyCap > 0}
      <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div class="h-full bg-sky-400" style="width: {dailyProgress}%"></div>
      </div>
    {/if}
  </section>

  {#if actionMessage}
    <div
      class="mt-3 rounded-md px-3 py-2 text-sm {actionMessage.kind === 'ok'
        ? 'bg-emerald-500/15 text-emerald-200'
        : 'bg-rose-500/15 text-rose-200'}"
    >
      {actionMessage.text}
    </div>
  {/if}

  <nav class="mt-6 flex gap-2 border-b border-white/10">
    {#each ["holdings", "ledger", "promotions"] as const as tab (tab)}
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium transition-colors {activeTab === tab
          ? 'border-b-2 border-sky-400 text-foreground'
          : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => (activeTab = tab)}
      >
        {tab === "holdings"
          ? "My Arts"
          : tab === "ledger"
            ? "Ledger"
            : "Promotions"}
      </button>
    {/each}
  </nav>

  <section class="mt-4">
    {#if loading && holdings.length === 0 && ledger.length === 0}
      <div class="text-sm text-muted-foreground">Loading…</div>
    {:else if activeTab === "holdings"}
      {#if holdings.length === 0}
        <div class="rounded-md border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">
          No alt-art copies yet. Open a deck in Deck Vault and pick "Change art" on a card to browse the catalog.
        </div>
      {:else}
        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
          {#each holdings as h (h.id)}
            <li class="rounded-md border border-white/10 bg-white/5 p-3 text-sm">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="font-medium text-foreground">{h.printingShortId}</div>
                  <div class="text-xs text-muted-foreground">
                    {h.acquisitionType === "rental" ? "Rental" : "Permanent"} ·
                    Acquired {formatDate(h.acquiredAt)}
                    {#if h.expiresAt}
                      · Expires {formatDate(h.expiresAt)}
                    {/if}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-muted-foreground">Cost</div>
                  <div class="font-semibold">{h.costMarks} Inkmarks</div>
                </div>
              </div>
              {#if h.acquisitionType === "permanent" && !h.refundedAt}
                <div class="mt-2 flex justify-end">
                  <button
                    type="button"
                    class="rounded border border-white/15 px-2 py-1 text-xs text-foreground/80 hover:bg-white/5 disabled:opacity-50"
                    title="Sell back for partial Inkmarks refund"
                    onclick={() => handleSellBack(h)}
                  >
                    Sell back
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    {:else if activeTab === "ledger"}
      {#if ledger.length === 0}
        <div class="rounded-md border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">
          Your ledger is empty. Play a match — win or lose — and your first Inkmarks will appear here. Nothing happens silently.
        </div>
      {:else}
        <ul class="divide-y divide-white/10 rounded-md border border-white/10 bg-white/5">
          {#each ledger as e (e.id)}
            <li class="flex items-baseline justify-between px-3 py-2 text-sm">
              <div>
                <div class="font-medium text-foreground">{formatReason(e)}</div>
                <div class="text-xs text-muted-foreground">{formatDate(e.createdAt)}</div>
              </div>
              <div
                class="font-semibold {e.entryType === 'debit'
                  ? 'text-rose-300'
                  : 'text-emerald-300'}"
              >
                {entryAmountSign(e)}{e.points}
              </div>
            </li>
          {/each}
        </ul>
        {#if nextLedgerCursor}
          <div class="mt-3 text-center">
            <button
              type="button"
              class="text-sm text-sky-400 hover:underline"
              onclick={loadMoreLedger}
            >
              Load more
            </button>
          </div>
        {/if}
      {/if}
    {:else if activeTab === "promotions"}
      {#if promotions.length === 0}
        <div class="rounded-md border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">
          No promotions running right now. Check back during seasonal events.
        </div>
      {:else}
        <ul class="space-y-2">
          {#each promotions as p (p.eventId)}
            <li class="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
              <div class="font-medium text-amber-200">{p.title}</div>
              {#if p.description}
                <div class="mt-1 text-xs text-muted-foreground">{p.description}</div>
              {/if}
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Until {formatDate(p.endsAt)}</span>
                {#if p.earnMultiplier}
                  <span class="text-amber-200">{p.earnMultiplier}× earn</span>
                {/if}
                {#if p.pricingMultiplier && p.pricingMultiplier !== 1}
                  <span class="text-amber-200">
                    {Math.round((1 - p.pricingMultiplier) * 100)}% off
                  </span>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  </section>
</div>
