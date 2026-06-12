<script lang="ts">
  import Activity from "@lucide/svelte/icons/activity";
  import BarChart3 from "@lucide/svelte/icons/bar-chart-3";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Clock from "@lucide/svelte/icons/clock";
  import LineChart from "@lucide/svelte/icons/line-chart";
  import Radio from "@lucide/svelte/icons/radio";
  import Trophy from "@lucide/svelte/icons/trophy";
  import UsersRound from "@lucide/svelte/icons/users-round";
  import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
  import {
    fetchMetaInsightsSnapshot,
    type ActivityResponse,
    type ColorPairMatchupsResponse,
    type ColorPairStat,
    type MetaPeriod,
    type PeakHoursResponse,
  } from "../api/meta-insights-api.js";
  import { cn } from "$lib/utils.js";

  type MatchupColorPair = ColorPairMatchupsResponse["colorPairs"][number];
  type MatchupCell = ColorPairMatchupsResponse["cells"][number];

  type SelectOption = {
    value: string;
    label: string;
    startDate?: string | null;
    endDate?: string | null;
  };

  interface Props {
    variant?: "compact" | "full";
  }

  let { variant = "compact" }: Props = $props();

  const formatOptions: SelectOption[] = [
    { value: "*", label: "All formats" },
    { value: "infinity", label: "Infinity" },
    { value: "core-constructed", label: "Core" },
  ];

  const queueOptions: SelectOption[] = [
    { value: "all", label: "All queues" },
    { value: "1", label: "Best of 1" },
    { value: "3", label: "Best of 3" },
  ];

  let periods = $state<MetaPeriod[]>([]);
  let activity = $state<ActivityResponse | null>(null);
  let colorPairs = $state<ColorPairStat[]>([]);
  let peakHours = $state<PeakHoursResponse | null>(null);
  let colorPairMatchups = $state<ColorPairMatchupsResponse | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let periodId = $state("");
  let formatId = $state("*");
  let bestOf = $state("all");
  let matchupMinGames = $state(50);
  let requestVersion = 0;

  const periodOptions = $derived(buildPeriodOptions(periods));
  const selectedPeriod = $derived.by(() => {
    if (periodId === "all") {
      return {
        value: "all",
        label: activity?.period?.label ?? "Full Season",
        startDate: activity?.period?.startDate ?? null,
        endDate: activity?.period?.endDate ?? null,
      };
    }

    return periodOptions.find((option) => option.value === periodId) ?? periodOptions[0] ?? null;
  });
  const selectedFormatLabel = $derived(
    formatOptions.find((option) => option.value === formatId)?.label ?? "All formats",
  );
  const selectedQueueLabel = $derived(
    queueOptions.find((option) => option.value === bestOf)?.label ?? "All queues",
  );
  const totalGames = $derived(activity?.totalGames ?? 0);
  const firstWinRate = $derived(activity?.winRateOtp ?? null);
  const secondWinRate = $derived(activity?.winRateOtd ?? null);
  const playDrawDelta = $derived(
    firstWinRate != null && secondWinRate != null ? firstWinRate - secondWinRate : null,
  );
  const sortedColorPairs = $derived(
    (() => {
      const pairs = [...colorPairs]
        .filter((pair) => pair.colors.length === 2)
        .sort((a, b) => b.winRate - a.winRate);

      return variant === "full" ? pairs : pairs.slice(0, 8);
    })(),
  );
  const gamesPerDay = $derived(activity?.gamesPerDay ?? []);
  const dailyMax = $derived(gamesPerDay.reduce((max, day) => Math.max(max, day.games), 0));
  const utcHourBuckets = $derived.by(() => {
    if (!peakHours) return [] as Array<{ hourUtc: number; games: number }>;
    const buckets = Array.from({ length: 24 }, (_, hourUtc) => ({ hourUtc, games: 0 }));

    for (const bucket of peakHours.buckets) {
      buckets[bucket.hourUtc].games += bucket.games;
    }

    return buckets;
  });
  const peakHourMax = $derived(utcHourBuckets.reduce((max, bucket) => Math.max(max, bucket.games), 0));
  const matchupPairs = $derived(
    colorPairMatchups?.colorPairs.filter((pair) => pair.colors.length === 2) ?? [],
  );
  const matchupCellMap = $derived.by(() => {
    const cells = new Map<string, MatchupCell>();
    if (!colorPairMatchups) return cells;

    for (const cell of colorPairMatchups.cells) {
      cells.set(`${cell.colorPairId}:${cell.opponentColorPairId}`, cell);
    }

    return cells;
  });

  $effect(() => {
    const abort = new AbortController();
    const currentVersion = ++requestVersion;
    loading = true;
    error = null;

    fetchMetaInsightsSnapshot(
      {
        periodId,
        formatId,
        bestOf,
        matchupMinGames,
        includeExtended: variant === "full",
      },
      abort.signal,
    )
      .then((snapshot) => {
        if (currentVersion !== requestVersion) return;
        periods = snapshot.periods;
        activity = snapshot.activity;
        colorPairs = snapshot.colorPairs?.data ?? [];
        peakHours = snapshot.peakHours;
        colorPairMatchups = snapshot.colorPairMatchups;
        if (!snapshot.activity && !snapshot.colorPairs) {
          error = "Meta data is not available for this segment yet.";
        }
      })
      .catch((loadError: Error) => {
        if (loadError.name === "AbortError" || currentVersion !== requestVersion) return;
        error = loadError.message || "Meta data is not available right now.";
        activity = null;
        colorPairs = [];
        peakHours = null;
        colorPairMatchups = null;
      })
      .finally(() => {
        if (currentVersion === requestVersion) {
          loading = false;
        }
      });

    return () => abort.abort();
  });

  function buildPeriodOptions(source: MetaPeriod[]): SelectOption[] {
    const weekly = source.map((period) => ({
      value: period.id,
      label: period.label || dateRangeLabel(period.startDate, period.endDate) || period.id,
      startDate: period.startDate,
      endDate: period.endDate,
    }));

    if (weekly.length === 0) {
      return [{ value: "", label: "Latest", startDate: null, endDate: null }];
    }

    return [{ value: "", label: "Latest", startDate: weekly[0].startDate, endDate: weekly[0].endDate }, ...weekly];
  }

  function formatNumber(value: number | null | undefined): string {
    if (value == null) return "-";
    return new Intl.NumberFormat().format(value);
  }

  function formatCompact(value: number): string {
    return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value);
  }

  function formatPercent(value: number | null | undefined): string {
    if (value == null) return "-";
    return `${value.toFixed(1)}%`;
  }

  function formatTurns(value: number | null | undefined): string {
    if (value == null) return "-";
    return value.toFixed(1);
  }

  function formatDuration(seconds: number | null | undefined): string {
    if (seconds == null) return "-";
    const rounded = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(rounded / 60);
    const remainder = rounded % 60;
    if (minutes === 0) return `${remainder}s`;
    return `${minutes}m ${remainder.toString().padStart(2, "0")}s`;
  }

  function formatDate(value: string | null | undefined): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function dateRangeLabel(startValue: string | null | undefined, endValue: string | null | undefined): string | null {
    const start = formatDate(startValue);
    const end = formatDate(endValue);
    if (start && end) return start === end ? start : `${start} - ${end}`;
    return start ?? end;
  }

  function barWidth(value: number | null | undefined): number {
    if (value == null) return 3;
    return Math.max(3, Math.min(100, value));
  }

  function playRate(pair: ColorPairStat): number {
    if (pair.playRate != null) return pair.playRate;
    if (totalGames <= 0) return 0;
    return (pair.games / totalGames) * 100;
  }

  function rowTone(winRate: number): string {
    if (winRate >= 52) return "bg-emerald-400";
    if (winRate >= 48) return "bg-amber-400";
    return "bg-rose-400";
  }

  function colorPairLabel(pair: { colors: string[]; label: string }): string {
    return pair.label || pair.colors.join(" / ");
  }

  function matchupTooltip(row: MatchupColorPair, opponent: MatchupColorPair, cell: MatchupCell | undefined): string {
    if (!cell) {
      return `${colorPairLabel(row)} vs ${colorPairLabel(opponent)}: no matchup data in this segment.`;
    }

    return `${colorPairLabel(row)} vs ${colorPairLabel(opponent)}: ${formatPercent(cell.winRate)} win rate across ${formatNumber(cell.games)} games.`;
  }

  function matrixCellStyle(winRate: number): string {
    const delta = Math.max(-16, Math.min(16, winRate - 50));
    const intensity = Math.abs(delta) / 16;
    if (delta >= 2) {
      return `background-color: rgba(16, 185, 129, ${0.16 + intensity * 0.44}); color: rgb(209, 250, 229);`;
    }
    if (delta <= -2) {
      return `background-color: rgba(244, 63, 94, ${0.14 + intensity * 0.4}); color: rgb(255, 228, 230);`;
    }
    return "background-color: rgba(39, 39, 42, 0.9); color: rgb(212, 212, 216);";
  }

  function dayLabel(period: string, index: number): string {
    const date = new Date(period);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric" }).format(date);
    }

    const compact = period.replace(/^day[-_]?/i, "").replace(/^D[-_]?/i, "");
    return compact.length > 0 ? compact.slice(-5) : String(index + 1);
  }

  function hourLabel(hour: number): string {
    if (hour === 0) return "12a";
    if (hour === 12) return "12p";
    return hour > 12 ? `${hour - 12}p` : `${hour}a`;
  }

  function playDrawSummary(): string {
    if (playDrawDelta == null) return "Not enough play/draw data yet.";
    const abs = Math.abs(playDrawDelta).toFixed(1);
    if (Math.abs(playDrawDelta) < 0.05) return "Going first and second are effectively even.";
    return playDrawDelta > 0
      ? `Going first provides a ${abs}% advantage`
      : `Going second provides a ${abs}% advantage`;
  }
</script>

<section
  class={cn(
    "rounded-[1.25rem] border border-white/10 bg-zinc-950/78 text-zinc-100 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.92)] backdrop-blur-sm",
    variant === "full" ? "mx-auto w-full max-w-[1054px] p-5 sm:p-6" : "p-4",
  )}
>
  <header class={cn("grid gap-4", variant === "full" && "lg:grid-cols-[minmax(0,1fr)_minmax(22rem,36rem)] lg:items-start")}>
    <div class="flex items-start gap-3">
      <div class={cn("flex shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300", variant === "full" ? "size-12" : "size-11")}>
        <Activity class="size-5" />
      </div>
      <div class="min-w-0">
        <h2 class={cn("font-semibold tracking-normal text-zinc-50", variant === "full" ? "text-2xl" : "text-lg")}>Meta Insights</h2>
        <p class={cn("mt-1 text-zinc-500", variant === "full" ? "text-sm" : "text-xs")}>
          {#if totalGames > 0}
            Powered by {formatNumber(totalGames)} Lorcana community games
          {:else}
            Powered by Lorcana community games
          {/if}
        </p>
      </div>
    </div>

    <div class="grid gap-2">
      <div class="inline-flex w-fit rounded-lg border border-zinc-800 bg-zinc-950/70 p-1">
        <button
          type="button"
          class={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors",
            periodId === "all" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
          )}
          onclick={() => (periodId = "all")}
        >
          <Trophy class="size-3" />
          Full Season
        </button>
        <button
          type="button"
          class={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors",
            periodId !== "all" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
          )}
          onclick={() => (periodId = "")}
        >
          <CalendarDays class="size-3" />
          By Week
        </button>
      </div>

      <div class="grid gap-2">
        <label class="grid gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
          <span class="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-zinc-500">Season</span>
          <select bind:value={periodId} class="h-7 min-w-0 border-0 bg-transparent p-0 text-sm text-zinc-100 outline-none">
            <option value="all">Full Season</option>
            {#each periodOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          {#if selectedPeriod}
            {@const selectedRange = dateRangeLabel(selectedPeriod.startDate, selectedPeriod.endDate)}
            {#if selectedRange}
              <span class="truncate text-[0.68rem] leading-4 text-zinc-500">{selectedRange}</span>
            {/if}
          {/if}
        </label>

        <div class={cn("grid gap-2", variant === "full" ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          <label class="grid gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
            <span class="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-zinc-500">Format</span>
            <select bind:value={formatId} class="h-7 min-w-0 border-0 bg-transparent p-0 text-sm text-zinc-100 outline-none">
              {#each formatOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </label>
          <label class="grid gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
            <span class="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-zinc-500">Queue</span>
            <select bind:value={bestOf} class="h-7 min-w-0 border-0 bg-transparent p-0 text-sm text-zinc-100 outline-none">
              {#each queueOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 text-xs text-zinc-500">
        <Radio class="size-3.5" />
        <span>{selectedFormatLabel} · {selectedQueueLabel}</span>
      </div>
    </div>
  </header>

  {#if loading}
    <div class="mt-4 grid gap-3">
      <div class="h-20 animate-pulse rounded-lg bg-white/[0.04]"></div>
      <div class="h-32 animate-pulse rounded-lg bg-white/[0.04]"></div>
    </div>
  {:else if error}
    <p class="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-sm text-zinc-400">{error}</p>
  {:else}
    <div class={cn("mt-4 grid gap-3", variant === "full" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2")}>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <div class="flex items-start justify-between gap-3">
          <span class="text-xs text-zinc-500">Total Games</span>
          <span class="rounded-md bg-zinc-800 p-1.5 text-zinc-400"><BarChart3 class="size-4" /></span>
        </div>
        <div class="mt-2 text-2xl font-semibold tracking-normal text-zinc-50">{formatNumber(totalGames)}</div>
      </div>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <div class="flex items-start justify-between gap-3">
          <span class="text-xs text-zinc-500">Active Players</span>
          <span class="rounded-md bg-zinc-800 p-1.5 text-zinc-400"><UsersRound class="size-4" /></span>
        </div>
        <div class="mt-2 text-2xl font-semibold tracking-normal text-zinc-50">{formatNumber(activity?.distinctPlayers)}</div>
      </div>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <div class="flex items-start justify-between gap-3">
          <span class="text-xs text-zinc-500">Avg Turns</span>
          <span class="rounded-md bg-zinc-800 p-1.5 text-zinc-400"><LineChart class="size-4" /></span>
        </div>
        <div class="mt-2 text-2xl font-semibold tracking-normal text-zinc-50">{formatTurns(activity?.avgTurns)}</div>
      </div>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <div class="flex items-start justify-between gap-3">
          <span class="text-xs text-zinc-500">Avg Duration</span>
          <span class="rounded-md bg-zinc-800 p-1.5 text-zinc-400"><Clock class="size-4" /></span>
        </div>
        <div class="mt-2 text-2xl font-semibold tracking-normal text-zinc-50">{formatDuration(activity?.avgDurationSec)}</div>
      </div>
    </div>

    <section class={cn("mt-3 rounded-lg border border-zinc-800 bg-zinc-900/90", variant === "full" ? "p-4" : "p-3")}>
      <div>
        <h3 class={cn("font-semibold text-zinc-50", variant === "full" ? "text-base" : "text-sm")}>Play/Draw Impact</h3>
        <p class="mt-1 text-xs text-zinc-500">Win rate when going first vs second</p>
      </div>
      <div class="mt-4 grid gap-3">
        <div class="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
          <span class="font-medium text-zinc-200">1st</span>
          <div class="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div class="h-full rounded-full bg-emerald-400" style="width: {barWidth(firstWinRate)}%"></div>
          </div>
          <span class="text-right font-medium tabular-nums text-zinc-200">{formatPercent(firstWinRate)}</span>
        </div>
        <div class="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
          <span class="font-medium text-zinc-200">2nd</span>
          <div class="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div class="h-full rounded-full bg-rose-400" style="width: {barWidth(secondWinRate)}%"></div>
          </div>
          <span class="text-right font-medium tabular-nums text-zinc-200">{formatPercent(secondWinRate)}</span>
        </div>
      </div>
      <p class="mt-3 text-xs text-zinc-500">
        {playDrawSummary()}
        <span class="ml-2 text-zinc-600">
          {formatNumber(activity?.gamesOtp ?? 0)} first-player games · {formatNumber(activity?.gamesOtd ?? 0)} second-player games
        </span>
      </p>
    </section>

    <section class={cn("mt-3 rounded-lg border border-zinc-800 bg-zinc-900/90", variant === "full" ? "p-4" : "p-3")}>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class={cn("font-semibold text-zinc-50", variant === "full" ? "text-base" : "text-sm")}>Color Pair Win Rates</h3>
          <p class="mt-1 text-xs text-zinc-500">Win rate by game-defined color pair</p>
        </div>
        <div class="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-xs text-zinc-400">
          <span class="rounded-md bg-zinc-800 px-2 py-1 text-zinc-100">Win %</span>
          {#if variant === "full"}
            <span class="px-2 py-1">All games</span>
            <span class="rounded-md bg-zinc-800 px-2 py-1 text-zinc-100">Top pairs</span>
          {/if}
        </div>
      </div>

      {#if sortedColorPairs.length === 0}
        <p class="py-6 text-center text-sm text-zinc-500">No color-pair data for this segment yet.</p>
      {:else}
        <div class="mt-4 grid gap-3">
          {#each sortedColorPairs as pair}
            <div class={cn("grid items-center gap-2 text-xs", variant === "full" ? "grid-cols-[3.5rem_minmax(0,1fr)_4rem_5.5rem_3.5rem]" : "grid-cols-[2.75rem_minmax(0,1fr)_3.5rem]")}>
              <div class="flex items-center gap-0.5" title={pair.label}>
                {#each pair.colors as color}
                  <img src={getInkSymbolUrl(color)} alt={color} class="size-5 shrink-0 rounded-full ring-1 ring-zinc-700" />
                {/each}
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-zinc-800">
                <div class={cn("h-full rounded-full", rowTone(pair.winRate))} style="width: {barWidth(pair.winRate)}%"></div>
              </div>
              <span class="text-right font-medium tabular-nums text-zinc-100">{formatPercent(pair.winRate)}</span>
              <span class={cn("text-right text-[0.68rem] tabular-nums text-zinc-500", variant !== "full" && "col-start-2")}>
                {formatNumber(pair.games)} games
              </span>
              <span class="rounded-full border border-zinc-800 px-2 py-0.5 text-center text-[0.68rem] tabular-nums text-zinc-400">
                {playRate(pair).toFixed(1)}%
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    {#if variant === "full"}
      <section class="mt-3 min-w-0 rounded-lg border border-zinc-800 bg-zinc-900/90 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-zinc-50">Color Pair Matchups</h3>
            <p class="mt-1 text-xs text-zinc-500">Rows are the played color pair. Columns are the opposing color pair.</p>
          </div>
          <div class="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-xs text-zinc-400">
            <button
              type="button"
              class={cn(
                "h-7 rounded-md px-2 font-semibold transition-colors",
                matchupMinGames === 1 ? "bg-zinc-800 text-zinc-100" : "hover:bg-zinc-900 hover:text-zinc-100",
              )}
              onclick={() => (matchupMinGames = 1)}
            >
              All games
            </button>
            <button
              type="button"
              class={cn(
                "h-7 rounded-md px-2 font-semibold transition-colors",
                matchupMinGames === 50 ? "bg-zinc-800 text-zinc-100" : "hover:bg-zinc-900 hover:text-zinc-100",
              )}
              onclick={() => (matchupMinGames = 50)}
            >
              50+ games
            </button>
          </div>
        </div>

        {#if matchupPairs.length === 0}
          <p class="py-8 text-center text-sm text-zinc-500">No matchup data for this segment yet.</p>
        {:else}
          <div class="mt-5 overflow-x-auto pb-2">
            <table class="min-w-max border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th class="w-16"></th>
                  {#each matchupPairs as opponent}
                    <th class="h-10 min-w-14 text-center" title={`Opponent: ${colorPairLabel(opponent)}`}>
                      <div class="flex justify-center gap-0.5">
                        {#each opponent.colors as color}
                          <img src={getInkSymbolUrl(color)} alt={color} class="size-[1.125rem] shrink-0 rounded-full ring-1 ring-zinc-700" />
                        {/each}
                      </div>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each matchupPairs as row}
                  <tr>
                    <th class="sticky left-0 z-10 bg-zinc-900 pr-2 text-right" title={`Deck: ${colorPairLabel(row)}`}>
                      <div class="flex justify-end gap-0.5">
                        {#each row.colors as color}
                          <img src={getInkSymbolUrl(color)} alt={color} class="size-[1.125rem] shrink-0 rounded-full ring-1 ring-zinc-700" />
                        {/each}
                      </div>
                    </th>
                    {#each matchupPairs as opponent}
                      {@const cell = matchupCellMap.get(`${row.id}:${opponent.id}`)}
                      <td
                        class="group/cell relative h-12 min-w-14 rounded-md border border-zinc-900/70 p-1 text-center align-middle"
                        style={cell ? matrixCellStyle(cell.winRate) : "background-color: rgba(24,24,27,0.65); color: rgb(82,82,91);"}
                        tabindex="0"
                        aria-label={matchupTooltip(row, opponent, cell)}
                      >
                        {#if cell}
                          <div class="font-semibold tabular-nums">{Math.round(cell.winRate)}%</div>
                          <div class="text-[0.62rem] opacity-75">{formatCompact(cell.games)}g</div>
                        {:else}
                          <span>-</span>
                        {/if}
                        <span class="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-64 -translate-x-1/2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-left text-xs leading-5 text-zinc-200 shadow-xl group-hover/cell:block group-focus/cell:block">
                          {matchupTooltip(row, opponent, cell)}
                        </span>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-4 text-[0.68rem] text-zinc-500">
            <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-emerald-500/70"></span>Favored</span>
            <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-zinc-600"></span>Even</span>
            <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-rose-500/70"></span>Unfavored</span>
          </div>
        {/if}
      </section>

      <div class="mt-3 grid gap-3 lg:grid-cols-2">
        <section class="min-w-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/90 p-4">
          <div>
            <h3 class="text-base font-semibold text-zinc-50">Games per Day</h3>
            <p class="mt-1 text-xs text-zinc-500">
              {#if selectedPeriod}
                {dateRangeLabel(selectedPeriod.startDate, selectedPeriod.endDate) ?? selectedPeriod.label}
              {:else}
                Selected time range
              {/if}
            </p>
          </div>

          {#if gamesPerDay.length === 0 || dailyMax === 0}
            <p class="py-8 text-center text-sm text-zinc-500">No daily activity data for this segment yet.</p>
          {:else}
            <div class="mt-6 overflow-x-auto pb-2">
              <div class="flex h-36 min-w-[32rem] items-end gap-2 border-b border-zinc-800/80">
                {#each gamesPerDay as day, index}
                  <div class="flex min-w-8 flex-1 flex-col items-center justify-end gap-2">
                    <div
                      class="w-full rounded-t-md bg-sky-400/85"
                      style="height: {Math.max(8, (day.games / dailyMax) * 120)}px"
                      title={`${dayLabel(day.periodId, index)}: ${formatNumber(day.games)} games`}
                    ></div>
                  </div>
                {/each}
              </div>
              <div class="mt-2 flex min-w-[32rem] gap-2 text-[0.65rem] text-zinc-600">
                {#each gamesPerDay as day, index}
                  <span class="min-w-8 flex-1 truncate text-center">{dayLabel(day.periodId, index)}</span>
                {/each}
              </div>
            </div>
          {/if}
        </section>

        <section class="min-w-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/90 p-4">
          <div>
            <h3 class="text-base font-semibold text-zinc-50">Peak Hours</h3>
            <p class="mt-1 text-xs text-zinc-500">Recorded game activity by UTC hour</p>
          </div>

          {#if peakHourMax === 0}
            <p class="py-8 text-center text-sm text-zinc-500">No hourly activity data for this segment yet.</p>
          {:else}
            <div class="mt-7 overflow-x-auto pb-2">
              <div class="flex h-32 min-w-[36rem] items-end gap-1">
                {#each utcHourBuckets as bucket}
                  <div class="flex min-w-5 flex-1 flex-col items-center justify-end gap-2">
                    <div
                      class="w-full rounded-t-sm bg-cyan-400/80"
                      style="height: {Math.max(4, (bucket.games / peakHourMax) * 112)}px"
                      title={`${hourLabel(bucket.hourUtc)} UTC: ${formatNumber(bucket.games)} games`}
                    ></div>
                  </div>
                {/each}
              </div>
              <div class="mt-2 flex min-w-[36rem] justify-between text-[0.65rem] text-zinc-600">
                <span>12a</span>
                <span>6a</span>
                <span>12p</span>
                <span>6p</span>
                <span>11p</span>
              </div>
            </div>
          {/if}
        </section>
      </div>
    {/if}
  {/if}
</section>
