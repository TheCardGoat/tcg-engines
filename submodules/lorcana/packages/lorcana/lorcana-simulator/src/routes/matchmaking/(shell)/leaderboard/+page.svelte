<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Trophy from "@lucide/svelte/icons/trophy";
  import { m } from "$lib/i18n/messages.js";
  import { Button } from "$lib/design-system/primitives/button";
  import type { PageData } from "./$types";

  type CompetitiveEntry = NonNullable<PageData["competitive"]>["entries"][number];
  type CasualEntry = NonNullable<PageData["casual"]>["entries"][number];

  interface RankTier {
    id: string;
    label: string;
    minRating: number;
    color: string;
    iconSrc: string;
  }

  interface BoardRow {
    key: string;
    rank: number;
    playerName: string;
    region: string;
    ratingLabel: string;
    bracketLabel: string;
    primaryMetric: string;
    secondaryMetric: string;
    streakLabel: string;
    tier: RankTier;
    badges: string[];
    isAnonymous: boolean;
  }

  interface QueueOption {
    value: string;
    label: string;
  }

  const TIER_ICON_BASE_URL = "https://cdn.tcg.online/public/thecardgoat/tiers";
  const RANK_TIERS: RankTier[] = [
    {
      id: "iron",
      get label() {
        return m["sim.leaderboard.tier.iron"]({});
      },
      minRating: 0,
      color: "oklch(0.64 0.025 255)",
      iconSrc: `${TIER_ICON_BASE_URL}/iron-bracket.webp`,
    },
    {
      id: "bronze",
      get label() {
        return m["sim.leaderboard.tier.bronze"]({});
      },
      minRating: 1000,
      color: "oklch(0.58 0.13 57)",
      iconSrc: `${TIER_ICON_BASE_URL}/bronze-bracket.webp`,
    },
    {
      id: "silver",
      get label() {
        return m["sim.leaderboard.tier.silver"]({});
      },
      minRating: 1150,
      color: "oklch(0.74 0.023 240)",
      iconSrc: `${TIER_ICON_BASE_URL}/silver-bracket.webp`,
    },
    {
      id: "gold",
      get label() {
        return m["sim.leaderboard.tier.gold"]({});
      },
      minRating: 1300,
      color: "oklch(0.74 0.15 86)",
      iconSrc: `${TIER_ICON_BASE_URL}/gold-bracket.webp`,
    },
    {
      id: "platinum",
      get label() {
        return m["sim.leaderboard.tier.platinum"]({});
      },
      minRating: 1450,
      color: "oklch(0.67 0.14 202)",
      iconSrc: `${TIER_ICON_BASE_URL}/platinum-bracket.webp`,
    },
    {
      id: "diamond",
      get label() {
        return m["sim.leaderboard.tier.diamond"]({});
      },
      minRating: 1600,
      color: "oklch(0.73 0.17 175)",
      iconSrc: `${TIER_ICON_BASE_URL}/diamond-bracket.webp`,
    },
    {
      id: "master",
      get label() {
        return m["sim.leaderboard.tier.master"]({});
      },
      minRating: 1750,
      color: "oklch(0.68 0.16 287)",
      iconSrc: `${TIER_ICON_BASE_URL}/master-bracket.webp`,
    },
  ];

  const REGION_OPTIONS = [
    {
      value: "",
      get label() {
        return m["sim.leaderboard.region.global"]({});
      },
    },
    { value: "NA", label: "NA" },
    { value: "EU", label: "EU" },
    { value: "APAC", label: "APAC" },
    { value: "LATAM", label: "LATAM" },
  ] as const;

  let { data }: { data: PageData } = $props();
  let selectedQueueValue = $state("");
  let selectedRegionValue = $state("");

  const queueOptions = $derived.by((): QueueOption[] => [
    ...data.availableFormats.map((format) => ({
      value: `competitive:${format.id}`,
      label: `${formatLabel(format.labelKey)} ${m["sim.leaderboard.mode.ranked"]({})}`,
    })),
    {
      value: "casual",
      label: m["sim.leaderboard.mode.casual"]({}),
    },
  ]);

  const queueValue = $derived(
    data.tab === "casual" ? "casual" : `competitive:${data.formatId}`,
  );
  const activeRows = $derived.by((): BoardRow[] =>
    data.tab === "competitive"
      ? competitiveRows(data.competitive?.entries ?? [])
      : casualRows(data.casual?.entries ?? []),
  );
  const visibleCount = $derived(activeRows.length);
  const totalPlayers = $derived(
    data.tab === "competitive" ? (data.competitive?.total ?? 0) : (data.casual?.total ?? 0),
  );
  const activeTitle = $derived(
    data.tab === "competitive"
      ? m["sim.leaderboard.mode.competitive"]({})
      : m["sim.leaderboard.mode.casual"]({}),
  );
  const activeQueueLabel = $derived.by(() => {
    if (data.tab === "casual") return m["sim.leaderboard.mode.casual"]({});
    const selected = data.availableFormats.find((format) => format.id === data.formatId);
    return selected ? formatLabel(selected.labelKey) : titleFromId(data.formatId);
  });
  const countLabel = $derived(
    data.tab === "competitive"
      ? m["sim.leaderboard.count.competitive"]({ shown: visibleCount, total: totalPlayers })
      : m["sim.leaderboard.count.casual"]({ shown: visibleCount, total: totalPlayers }),
  );
  const currentUserRank = $derived.by((): { rank: number; ratingLabel: string } | null => {
    if (data.region) return null;

    if (data.tab === "competitive") {
      const currentUser = data.competitive?.currentUser;
      if (!currentUser) return null;
      return { rank: currentUser.rank, ratingLabel: String(Math.round(currentUser.mmr)) };
    }

    const currentUser = data.casual?.currentUser;
    if (!currentUser) return null;
    return { rank: currentUser.rank, ratingLabel: currentUser.goatScore.toFixed(1) };
  });
  const showCurrentUserSummary = $derived.by(
    () =>
      currentUserRank !== null &&
      !activeRows.some((row) => row.rank === currentUserRank.rank),
  );

  $effect(() => {
    selectedQueueValue = queueValue;
    selectedRegionValue = data.region ?? "";
  });

  function formatLabel(key: string): string {
    switch (key) {
      case "sim.leaderboard.format.infinity":
        return m["sim.leaderboard.format.infinity"]({});
      case "sim.leaderboard.format.coreConstructed":
        return m["sim.leaderboard.format.coreConstructed"]({});
      default:
        return titleFromId(key);
    }
  }

  function titleFromId(id: string): string {
    return id
      .split(/[-_.]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function setQuery(updates: Record<string, string | null>) {
    const nextUrl = new URL(page.url);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") nextUrl.searchParams.delete(key);
      else nextUrl.searchParams.set(key, value);
    }

    const query = nextUrl.searchParams.toString();
    void goto(query ? `${nextUrl.pathname}?${query}` : nextUrl.pathname, {
      keepFocus: true,
      replaceState: true,
    });
  }

  function setQueue(value: string) {
    if (value === queueValue) return;

    if (value === "casual") {
      setQuery({ tab: "casual", formatId: null });
      return;
    }

    setQuery({
      tab: "competitive",
      formatId: value.replace(/^competitive:/, ""),
    });
  }

  function setRegion(value: string) {
    const nextRegion = value || null;
    if (nextRegion === data.region) return;
    setQuery({ region: nextRegion });
  }

  function competitiveRows(entries: CompetitiveEntry[]): BoardRow[] {
    return entries.map((entry) => {
      const decided = entry.gamesWon + entry.losses;
      const winrate = decided > 0 ? `${Math.round((entry.gamesWon / decided) * 100)}%` : "-";
      const rating = Math.round(entry.mmr);
      const tier = entry.bracket
        ? (tierForBracket(entry.bracket) ?? tierForRating(rating))
        : tierForRating(rating);

      return {
        key: entry.gameProfileId,
        rank: entry.rank,
        playerName: entry.displayName ?? m["sim.leaderboard.player.anonymous"]({}),
        region: entry.region ?? m["sim.leaderboard.region.global"]({}),
        ratingLabel: String(rating),
        bracketLabel: entry.bracket ? titleFromId(entry.bracket) : tier.label,
        primaryMetric: `${entry.gamesWon} / ${entry.losses}`,
        secondaryMetric: winrate,
        streakLabel: String(entry.winStreak),
        tier,
        badges: [],
        isAnonymous: !entry.displayName,
      };
    });
  }

  function casualRows(entries: CasualEntry[]): BoardRow[] {
    return entries.map((entry) => {
      const tier = tierForRating(casualScoreToRating(entry.goatScore));
      return {
        key: entry.gameProfileId,
        rank: entry.rank,
        playerName: entry.displayName ?? m["sim.leaderboard.player.anonymous"]({}),
        region: entry.region ?? m["sim.leaderboard.region.global"]({}),
        ratingLabel: entry.goatScore.toFixed(1),
        bracketLabel: m["sim.leaderboard.casual.goatScore"]({}),
        primaryMetric: String(entry.gamesPlayedMonth),
        secondaryMetric: String(entry.activeDaysMonth),
        streakLabel: String(entry.currentStreak),
        tier,
        badges: entry.badges.map(badgeLabel),
        isAnonymous: !entry.displayName,
      };
    });
  }

  function badgeLabel(badge: string): string {
    switch (badge) {
      case "hot_streak":
        return m["sim.leaderboard.badge.hotStreak"]({});
      case "deck_explorer":
        return m["sim.leaderboard.badge.deckExplorer"]({});
      case "great_sport":
        return m["sim.leaderboard.badge.greatSport"]({});
      case "daily_player":
        return m["sim.leaderboard.badge.dailyPlayer"]({});
      default:
        return titleFromId(badge);
    }
  }

  function casualScoreToRating(score: number): number {
    return 950 + Math.max(0, score) * 10;
  }

  function tierForRating(rating: number): RankTier {
    let selected = RANK_TIERS[0];
    for (const tier of RANK_TIERS) {
      if (rating >= tier.minRating) selected = tier;
    }
    return selected;
  }

  const BRACKET_ID_ALIASES: Record<string, string> = {
    seed: "iron",
    seeded: "iron",
    placement: "iron",
  };

  function tierForBracket(bracketId: string): RankTier | undefined {
    const resolved = BRACKET_ID_ALIASES[bracketId] ?? bracketId;
    return RANK_TIERS.find((tier) => tier.id === resolved);
  }

  function initials(name: string): string {
    const parts = name
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
</script>

<svelte:head>
  <title>{m["sim.leaderboard.meta.title"]({})}</title>
  <meta name="description" content={m["sim.leaderboard.meta.description"]({})} />
</svelte:head>

<div
  class="min-h-0 flex-1 overflow-y-auto px-3 pb-24 pt-1 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] sm:px-6 lg:px-8"
>
  <section class="mx-auto grid w-full max-w-6xl gap-4" aria-labelledby="leaderboard-title">
    <header class="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/72 p-4 shadow-2xl shadow-slate-950/30 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="min-w-0">
        <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/80">
          <Trophy class="size-4" aria-hidden="true" />
          {m["sim.leaderboard.eyebrow"]({})}
        </div>
        <h1 id="leaderboard-title" class="text-2xl font-semibold tracking-tight text-slate-50">
          {m["sim.leaderboard.title"]({})}
        </h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
          {countLabel}
        </p>
      </div>

      <div
        class="grid gap-2 sm:grid-cols-3 lg:min-w-[31rem]"
        aria-label={m["sim.leaderboard.filters.aria"]({})}
      >
        <label class="grid gap-1 text-xs font-medium text-slate-400">
          <span>{m["sim.leaderboard.filter.season"]({})}</span>
          <select
            class="h-10 rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/25"
            aria-label={m["sim.leaderboard.filter.season"]({})}
            value="current"
          >
            <option value="current">{m["sim.leaderboard.filter.seasonCurrent"]({})}</option>
          </select>
        </label>

        <label class="grid gap-1 text-xs font-medium text-slate-400">
          <span>{m["sim.leaderboard.filter.queue"]({})}</span>
          <select
            class="h-10 rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/25"
            bind:value={selectedQueueValue}
            aria-label={m["sim.leaderboard.filter.queue"]({})}
            onchange={(event) => setQueue(event.currentTarget.value)}
          >
            {#each queueOptions as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </label>

        <label class="grid gap-1 text-xs font-medium text-slate-400">
          <span>{m["sim.leaderboard.filter.region"]({})}</span>
          <select
            class="h-10 rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/25"
            bind:value={selectedRegionValue}
            aria-label={m["sim.leaderboard.filter.region"]({})}
            onchange={(event) => setRegion(event.currentTarget.value)}
          >
            {#each REGION_OPTIONS as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </label>
      </div>
    </header>

    <section class="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/62 p-4 sm:p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {m["sim.leaderboard.rankTiers"]({})}
          </p>
          <h2 class="mt-1 text-base font-semibold text-slate-100">{activeTitle}</h2>
        </div>
        <div
          class="flex flex-wrap items-center gap-2"
          aria-label={m["sim.leaderboard.rankTiersAria"]({})}
        >
          {#each RANK_TIERS as tier (tier.id)}
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300"
              style={`--tier-color: ${tier.color}`}
              title={tier.label}
            >
              <img
                class="size-5 rounded-full"
                src={tier.iconSrc}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
              <span class="hidden sm:inline">{tier.label}</span>
            </span>
          {/each}
        </div>
      </div>

      {#if data.errors.length > 0}
        <div class="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
          {m["sim.leaderboard.error"]({})}
        </div>
      {/if}

      {#if activeRows.length === 0}
        <div class="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-8 text-center text-sm text-slate-400">
          {m["sim.leaderboard.empty"]({})}
        </div>
      {:else}
        <div class="overflow-x-auto rounded-xl border border-white/10">
          <table class="w-full min-w-[58rem] border-collapse text-left text-sm">
            <caption class="sr-only">
              {m["sim.leaderboard.table.caption"]({ queue: activeQueueLabel })}
            </caption>
            <thead class="bg-slate-900/92 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th class="px-4 py-3 font-semibold">{m["sim.leaderboard.col.rank"]({})}</th>
                <th class="px-4 py-3 font-semibold">{m["sim.leaderboard.col.player"]({})}</th>
                <th class="px-4 py-3 font-semibold">{m["sim.leaderboard.col.region"]({})}</th>
                <th class="px-4 py-3 font-semibold">
                  {data.tab === "competitive"
                    ? m["sim.leaderboard.col.bracket"]({})
                    : m["sim.leaderboard.col.badges"]({})}
                </th>
                <th class="px-4 py-3 font-semibold">
                  {data.tab === "competitive"
                    ? m["sim.leaderboard.col.mmr"]({})
                    : m["sim.leaderboard.col.goatScore"]({})}
                </th>
                <th class="px-4 py-3 font-semibold">
                  {data.tab === "competitive"
                    ? m["sim.leaderboard.col.wl"]({})
                    : m["sim.leaderboard.col.games"]({})}
                </th>
                <th class="px-4 py-3 font-semibold">
                  {data.tab === "competitive"
                    ? m["sim.leaderboard.col.winrate"]({})
                    : m["sim.leaderboard.col.activeDays"]({})}
                </th>
                <th class="px-4 py-3 font-semibold">{m["sim.leaderboard.col.streak"]({})}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10 bg-slate-950/70">
              {#each activeRows as row (row.key)}
                <tr class="transition-colors hover:bg-white/[0.035]">
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-2 font-semibold text-slate-100">
                      <img
                        class="size-7 rounded-full"
                        src={row.tier.iconSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                      />
                      #{row.rank}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="flex min-w-0 items-center gap-3">
                      <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-xs font-semibold text-slate-200">
                        {initials(row.playerName)}
                      </span>
                      <span
                        class="truncate font-medium text-slate-100"
                        class:text-slate-500={row.isAnonymous}
                      >
                        {row.playerName}
                      </span>
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-300">{row.region}</td>
                  <td class="px-4 py-3">
                    {#if data.tab === "competitive"}
                      <span class="inline-flex items-center rounded-full border border-white/10 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-200">
                        {row.bracketLabel}
                      </span>
                    {:else if row.badges.length > 0}
                      <span class="flex flex-wrap gap-1.5">
                        {#each row.badges.slice(0, 2) as badge (badge)}
                          <span class="rounded-full border border-sky-300/20 bg-sky-300/10 px-2 py-0.5 text-xs text-sky-100">
                            {badge}
                          </span>
                        {/each}
                      </span>
                    {:else}
                      <span class="text-slate-500">-</span>
                    {/if}
                  </td>
                  <td class="px-4 py-3 font-semibold tabular-nums text-slate-50">
                    {row.ratingLabel}
                  </td>
                  <td class="px-4 py-3 tabular-nums text-slate-300">{row.primaryMetric}</td>
                  <td class="px-4 py-3 tabular-nums text-slate-300">{row.secondaryMetric}</td>
                  <td class="px-4 py-3 tabular-nums text-slate-300">{row.streakLabel}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <div class="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        {#if showCurrentUserSummary && currentUserRank}
          <p>
            {m["sim.leaderboard.yourRank"]({ rank: currentUserRank.rank })}
            <span class="text-slate-400">{currentUserRank.ratingLabel}</span>
          </p>
        {:else}
          <p>{m["sim.leaderboard.publicNote"]({})}</p>
        {/if}

        {#if data.tab === "competitive"}
          <p>{m["sim.leaderboard.placementNote"]({ games: 20 })}</p>
        {:else}
          <p>{m["sim.leaderboard.casualNote"]({ month: data.month })}</p>
        {/if}
      </div>
    </section>

    <div class="flex justify-start">
      <Button
        variant="ghost"
        size="sm"
        class="text-slate-400 hover:text-slate-100"
        onclick={() => goto("/matchmaking")}
      >
        {m["sim.leaderboard.backToLobby"]({})}
      </Button>
    </div>
  </section>
</div>
