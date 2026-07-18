<script lang="ts">
  import { goto } from "$app/navigation";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import { getSeasonResults } from "$lib/features/matchmaking/content/season-results.js";
  import { m } from "$lib/i18n/messages.js";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Trophy from "@lucide/svelte/icons/trophy";

  let { data } = $props();
  const season = $derived(data.season);
  const summary = $derived(
    typeof season.contentJson.summary === "string"
      ? season.contentJson.summary
      : "Play linked ranked queues during this season to build a separate rating for each format.",
  );
  const timeline = $derived(
    Array.isArray(season.contentJson.timeline)
      ? (season.contentJson.timeline as Array<{ date?: string; label?: string; detail?: string }>)
      : [],
  );
  const prizeStructure = $derived(
    Array.isArray(season.contentJson.prizeStructure)
      ? (season.contentJson.prizeStructure as Array<{
          format?: string;
          prizes?: Array<{ place?: string; reward?: string }>;
        }>)
      : [],
  );
  const prizes = $derived(
    Array.isArray(season.contentJson.prizes)
      ? (season.contentJson.prizes as Array<{
          format?: string;
          mode?: string;
          place?: string;
          prize?: string;
        }>)
      : [],
  );
  const seasonResults = $derived(getSeasonResults(season.slug));
  const formatDate = (value: string | null, offsetDays = 0) => {
    if (!value) return "Open ended";
    const date = new Date(value);
    date.setUTCDate(date.getUTCDate() + offsetDays);
    return date.toLocaleDateString(undefined, { dateStyle: "medium", timeZone: "UTC" });
  };
</script>

<PageMeta title={`${season.name} Season`} description={summary} />

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl pb-12 pt-3">
    <div class="flex flex-wrap items-center gap-2">
      <Button variant="ghost" size="sm" onclick={() => goto("/matchmaking")}><ArrowLeft class="size-4" />Back to matchmaking</Button>
      <Button variant="ghost" size="sm" href="/matchmaking/season"><Trophy class="size-4" />All seasons</Button>
    </div>
    <header class="mt-5 border-b border-white/10 pb-6">
      <div class="flex flex-wrap items-center gap-2"><Badge>{season.isActive ? "Active" : "Season"}</Badge>{#if season.isPrimary}<Badge variant="outline">Featured</Badge>{/if}</div>
      <h1 class="mt-3 text-3xl font-semibold text-slate-100">{season.name}</h1>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{summary}</p>
      <div class="mt-4 flex items-center gap-2 text-sm text-slate-300"><CalendarDays class="size-4" />{formatDate(season.startsAt)} to {formatDate(season.endsAt, -1)}</div>
    </header>

    {#if seasonResults}
      <section class="border-b border-white/10 py-7" aria-labelledby="season-results-heading">
        <div class="flex items-start gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200"
          >
            <Trophy class="size-5" />
          </span>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              {m["sim.season.results.eyebrow"]({})}
            </p>
            <h2 id="season-results-heading" class="mt-1 text-xl font-semibold text-slate-100">
              {m["sim.season.results.title"]({})}
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {m["sim.season.results.summary"]({})}
            </p>
          </div>
        </div>

        <div class="mt-5 grid gap-4 lg:grid-cols-2">
          {#each seasonResults.formats as format (format.formatName)}
            <section class="overflow-hidden rounded-lg border border-white/10 bg-slate-950/50">
              <h3 class="border-b border-white/10 px-4 py-3 font-semibold text-slate-100">
                {format.formatName}
              </h3>
              <ol class="divide-y divide-white/10">
                {#each format.standings as standing (standing.place)}
                  <li class="flex items-center gap-3 px-4 py-3">
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold {standing.place ===
                      1
                        ? 'border-amber-300/30 bg-amber-300/10 text-amber-200'
                        : 'border-white/10 bg-white/[0.03] text-slate-300'}"
                      aria-label={m["sim.season.results.place"]({ place: standing.place })}
                    >
                      {standing.place}
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-slate-100">{standing.playerName}</p>
                    </div>
                    <Badge variant="outline" class="shrink-0 capitalize text-[10px] text-slate-400">
                      {standing.tier}
                    </Badge>
                  </li>
                {/each}
              </ol>
            </section>
          {/each}
        </div>
      </section>
    {/if}

    {#if prizes.length > 0}
      <section class="border-b border-white/10 py-7" aria-labelledby="season-prizes-heading">
        <div class="flex items-start gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200"
          >
            <Trophy class="size-5" />
          </span>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Prize pool</p>
            <h2 id="season-prizes-heading" class="mt-1 text-xl font-semibold text-slate-100">First place in every ranked queue</h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Best of 1 winners receive an Illumineer's Trove. Best of 3 winners receive a booster box.
            </p>
          </div>
        </div>

        <div class="mt-5 overflow-hidden rounded-lg border border-white/10 bg-slate-950/50">
          <dl class="divide-y divide-white/10">
            {#each prizes as prize (`${prize.format}-${prize.mode}-${prize.place}`)}
              <div class="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4">
                <dt class="font-medium text-slate-200">{prize.format} · Best of {prize.mode}</dt>
                <dd class="text-slate-400"><span class="mr-2 text-slate-500">{prize.place}</span>{prize.prize}</dd>
              </div>
            {/each}
          </dl>
        </div>
      </section>
    {/if}

    {#if prizeStructure.length > 0}
      <section class="border-b border-white/10 py-7" aria-labelledby="prize-pool-heading">
        <div class="flex items-start gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200"
          >
            <Trophy class="size-5" />
          </span>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Prize pool</p>
            <h2 id="prize-pool-heading" class="mt-1 text-xl font-semibold text-slate-100">Ranked queue rewards</h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Prizes were awarded in both Core Constructed and Infinity for each ranked queue format.
            </p>
          </div>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          {#each prizeStructure as group (group.format)}
            <section class="overflow-hidden rounded-lg border border-white/10 bg-slate-950/50">
              <h3 class="border-b border-white/10 px-4 py-3 font-semibold text-slate-100">{group.format}</h3>
              <dl class="divide-y divide-white/10">
                {#each group.prizes ?? [] as prize (prize.place)}
                  <div class="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
                    <dt class="font-medium text-slate-200">{prize.place}</dt>
                    <dd class="text-right text-slate-400">{prize.reward}</dd>
                  </div>
                {/each}
              </dl>
            </section>
          {/each}
        </div>
      </section>
    {/if}

    {#if timeline.length > 0}
      <section class="py-7"><h2 class="text-lg font-semibold text-slate-100">Timeline</h2><div class="mt-3 divide-y divide-white/10 border-y border-white/10">{#each timeline as item}<div class="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]"><span class="text-sm text-slate-400">{item.date ?? ""}</span><div><p class="font-medium text-slate-100">{item.label ?? "Milestone"}</p>{#if item.detail}<p class="mt-1 text-sm text-slate-400">{item.detail}</p>{/if}</div></div>{/each}</div></section>
    {:else}
      <Card class="mt-7 border-white/10 bg-slate-950/70"><CardHeader><CardTitle class="flex items-center gap-2"><Trophy class="size-5" />Season standings</CardTitle></CardHeader><CardContent class="text-sm text-slate-400">Queue-specific standings and prizes will appear here when configured by the season administrator.</CardContent></Card>
    {/if}
  </div>
</div>
