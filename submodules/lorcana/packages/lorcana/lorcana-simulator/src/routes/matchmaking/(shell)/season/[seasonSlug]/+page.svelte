<script lang="ts">
  import { goto } from "$app/navigation";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import {
    EYEBROW_CLASS,
    SURFACE_CARD_CLASS,
  } from "$lib/features/matchmaking/ui/matchmaking-lobby.constants.js";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Crown from "@lucide/svelte/icons/crown";
  import Gift from "@lucide/svelte/icons/gift";
  import Medal from "@lucide/svelte/icons/medal";
  import Swords from "@lucide/svelte/icons/swords";
  import Trophy from "@lucide/svelte/icons/trophy";
  import UsersRound from "@lucide/svelte/icons/users-round";

  type SeasonMilestone = {
    date: string;
    label: string;
    detail: string;
    state: "start" | "active" | "event" | "final";
  };

  type PrizePlace = {
    place: string;
    prize: string;
    highlight?: boolean;
  };

  type QueuePrize = {
    mode: string;
    eligibility: string;
    prizes: PrizePlace[];
  };

  type FormatPrize = {
    name: string;
    description: string;
    accentClass: string;
    queues: QueuePrize[];
  };

  const PAGE_TITLE = "Wilds Unknown Season - Timeline and Prizes";
  const PAGE_DESCRIPTION =
    "Wilds Unknown season timeline, ranked prize structure, and Champion of the Month details for Lorcanito matchmaking.";

  const milestones: SeasonMilestone[] = [
    {
      date: "May 18, 2026",
      label: "Season opens",
      detail:
        "Ranked ladders begin for Core Constructed and Infinity across Best of 1 and Best of 3 queues.",
      state: "start",
    },
    {
      date: "May 31, 2026",
      label: "May champion snapshot",
      detail:
        "Top players from each eligible ranked and casual category are selected for the monthly champion event.",
      state: "event",
    },
    {
      date: "June 30, 2026",
      label: "June champion snapshot",
      detail:
        "A second monthly field is built from the top players in each category, including ranked and casual queues.",
      state: "event",
    },
    {
      date: "July 12, 2026",
      label: "Season closes",
      detail:
        "Final ranked placements are locked and season prizes are assigned from the leaderboards.",
      state: "final",
    },
  ];

  const rankedPrizes: FormatPrize[] = [
    {
      name: "Core Constructed",
      description:
        "The standard competitive deckbuilding format for the Wilds Unknown ranked ladder.",
      accentClass: "from-amber-300/20 via-amber-300/8 to-transparent",
      queues: [
        {
          mode: "Best of 1",
          eligibility: "Ranked queue",
          prizes: [
            {
              place: "1st",
              prize: "1 Wilds Unknown booster box",
              highlight: true,
            },
          ],
        },
        {
          mode: "Best of 3",
          eligibility: "Ranked queue",
          prizes: [
            {
              place: "1st",
              prize: "1 booster box + 1 Illumineer's Trove",
              highlight: true,
            },
            { place: "2nd", prize: "1 booster box" },
            { place: "3rd", prize: "1 Illumineer's Trove" },
          ],
        },
      ],
    },
    {
      name: "Infinity",
      description:
        "The open card pool ladder for players who want the widest competitive field.",
      accentClass: "from-sky-300/20 via-sky-300/8 to-transparent",
      queues: [
        {
          mode: "Best of 1",
          eligibility: "Ranked queue",
          prizes: [
            {
              place: "1st",
              prize: "1 Wilds Unknown booster box",
              highlight: true,
            },
          ],
        },
        {
          mode: "Best of 3",
          eligibility: "Ranked queue",
          prizes: [
            {
              place: "1st",
              prize: "1 booster box + 1 Illumineer's Trove",
              highlight: true,
            },
            { place: "2nd", prize: "1 booster box" },
            { place: "3rd", prize: "1 Illumineer's Trove" },
          ],
        },
      ],
    },
  ];

  const championCategories = [
    "Ranked Best of 1",
    "Ranked Best of 3",
    "Casual Best of 1",
    "Casual Best of 3",
  ];
</script>

<PageMeta title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-6xl pb-12 pt-2">
    <div class="mb-4 flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        class="text-slate-400 hover:text-slate-200"
        onclick={() => goto("/matchmaking")}
        aria-label="Back to matchmaking"
      >
        <ArrowLeft class="size-4" />
      </Button>
      <h1 class="text-lg font-semibold tracking-tight text-slate-100">
        Season
      </h1>
    </div>

    <section
      class="relative mb-6 overflow-hidden rounded-2xl border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(6,78,59,0.42),rgba(15,23,42,0.92)_46%,rgba(88,28,135,0.34))] p-5 sm:p-8"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(52,211,153,0.18),transparent_34%),radial-gradient(circle_at_86%_74%,rgba(251,191,36,0.12),transparent_34%)]"
        aria-hidden="true"
      ></div>
      <div class="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:items-end">
        <div>
          <div class="flex items-center gap-2 text-emerald-200">
            <Crown class="size-4" />
            <p class={EYEBROW_CLASS}>May 18 - July 12, 2026</p>
          </div>
          <h2
            class="mt-3 max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl"
          >
            Wilds Unknown
          </h2>
          <p class="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
            A ranked season for Core Constructed and Infinity, with prizes for
            the top ladders and a new monthly champion event to keep every queue
            worth fighting for.
          </p>
        </div>

        <div
          class="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/24 p-3 backdrop-blur-sm"
          aria-label="Season summary"
        >
          <div class="rounded-lg bg-white/[0.05] p-3">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Duration
            </p>
            <p class="mt-1 text-2xl font-bold text-slate-50 tabular-nums">
              8 wks
            </p>
          </div>
          <div class="rounded-lg bg-white/[0.05] p-3">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Formats
            </p>
            <p class="mt-1 text-2xl font-bold text-emerald-200 tabular-nums">
              2
            </p>
          </div>
          <div class="rounded-lg bg-white/[0.05] p-3">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Ranked queues
            </p>
            <p class="mt-1 text-2xl font-bold text-emerald-200 tabular-nums">
              4
            </p>
          </div>
          <div class="rounded-lg bg-white/[0.05] p-3">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Monthly event
            </p>
            <p class="mt-1 text-2xl font-bold text-slate-50 tabular-nums">
              Top 8
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section>
        <div class="mb-3 flex items-center gap-2 text-slate-200">
          <CalendarDays class="size-4 text-emerald-300" />
          <p class={EYEBROW_CLASS}>Season timeline</p>
        </div>

        <Card class={SURFACE_CARD_CLASS}>
          <CardContent class="p-4 sm:p-5">
            <ol class="relative flex flex-col gap-4">
              {#each milestones as milestone, index (milestone.label)}
                <li class="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                  {#if index < milestones.length - 1}
                    <span
                      class="absolute left-[1.0625rem] top-9 h-[calc(100%+0.75rem)] w-px bg-white/10"
                      aria-hidden="true"
                    ></span>
                  {/if}
                  <span
                    class="relative z-10 flex size-9 items-center justify-center rounded-full border {milestone.state ===
                    'final'
                      ? 'border-amber-300/40 bg-amber-300/12 text-amber-200'
                      : milestone.state === 'event'
                        ? 'border-sky-300/35 bg-sky-300/12 text-sky-200'
                        : 'border-emerald-300/40 bg-emerald-300/12 text-emerald-200'}"
                  >
                    {#if milestone.state === "final"}
                      <Trophy class="size-4" aria-hidden="true" />
                    {:else if milestone.state === "event"}
                      <UsersRound class="size-4" aria-hidden="true" />
                    {:else}
                      <CalendarDays class="size-4" aria-hidden="true" />
                    {/if}
                  </span>
                  <div class="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {milestone.date}
                    </p>
                    <h3 class="mt-1 text-sm font-semibold text-slate-100">
                      {milestone.label}
                    </h3>
                    <p class="mt-1 text-sm leading-6 text-slate-400">
                      {milestone.detail}
                    </p>
                  </div>
                </li>
              {/each}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <div class="mb-3 flex items-center gap-2 text-slate-200">
          <Gift class="size-4 text-amber-300" />
          <p class={EYEBROW_CLASS}>Ranked prizes</p>
        </div>

        <div class="grid gap-4">
          {#each rankedPrizes as format (format.name)}
            <Card class="{SURFACE_CARD_CLASS} gap-0 overflow-hidden py-0">
              <CardHeader class="relative overflow-hidden rounded-t-xl pb-3 pt-5">
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-r {format.accentClass}"
                  aria-hidden="true"
                ></div>
                <div class="relative">
                  <CardTitle class="flex items-center gap-2 text-xl text-slate-100">
                    <Swords class="size-5 text-slate-300" aria-hidden="true" />
                    {format.name}
                  </CardTitle>
                  <CardDescription class="mt-1 text-sm leading-6 text-slate-400">
                    {format.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent class="grid gap-3 px-6 pb-6 pt-3 sm:grid-cols-2">
                {#each format.queues as queue (queue.mode)}
                  <div class="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <h3 class="text-sm font-semibold text-slate-100">
                        {queue.mode}
                      </h3>
                      <Badge
                        variant="outline"
                        class="border-white/10 text-[10px] uppercase tracking-wide text-slate-400"
                      >
                        {queue.eligibility}
                      </Badge>
                    </div>

                    <ul class="mt-3 flex flex-col gap-2">
                      {#each queue.prizes as prize (prize.place)}
                        <li
                          class="flex items-start gap-2 rounded-lg border px-2.5 py-2 {prize.highlight
                            ? 'border-amber-300/30 bg-amber-300/[0.08]'
                            : 'border-white/8 bg-black/12'}"
                        >
                          <Medal
                            class="mt-0.5 size-4 shrink-0 {prize.highlight
                              ? 'text-amber-300'
                              : 'text-slate-500'}"
                            aria-hidden="true"
                          />
                          <div class="min-w-0">
                            <p class="text-xs font-semibold text-slate-200">
                              {prize.place} place
                            </p>
                            <p class="mt-0.5 text-sm leading-5 text-slate-400">
                              {prize.prize}
                            </p>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/each}
              </CardContent>
            </Card>
          {/each}
        </div>
      </section>
    </div>

    <section class="mt-6">
      <div class="mb-3 flex items-center gap-2 text-slate-200">
        <Trophy class="size-4 text-sky-300" />
        <p class={EYEBROW_CLASS}>Champion of the Month</p>
      </div>

      <Card class={SURFACE_CARD_CLASS}>
        <CardContent class="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-50">
              A monthly event for the players setting the pace.
            </h2>
            <p class="mt-2 text-sm leading-6 text-slate-400">
              At the end of each month, the top players from each category are
              invited into a special event. Ranked and casual queues are both
              included, so strong play across the whole platform can earn a
              shot at the monthly title.
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-400">
              The winner receives a prize. The exact prize and final tournament
              structure are still being finalized.
            </p>
          </div>

          <div class="rounded-xl border border-sky-300/20 bg-sky-300/[0.055] p-3">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-slate-100">
                Example: Infinity Category
              </h3>
              <Badge class="bg-sky-300/16 text-sky-100 hover:bg-sky-300/16">
                32 players
              </Badge>
            </div>

            <div class="mt-3 grid gap-2 sm:grid-cols-2">
              {#each championCategories as category (category)}
                <div class="rounded-lg border border-white/10 bg-black/18 p-3">
                  <p class="text-sm font-semibold text-slate-100">{category}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-400">
                    Top 8 qualify from this queue.
                  </p>
                </div>
              {/each}
            </div>

            <div class="mt-3 rounded-lg border border-white/10 bg-black/18 p-3">
              <p class="text-sm font-semibold text-slate-100">
                Duplicate player rule
              </p>
              <p class="mt-1 text-xs leading-5 text-slate-400">
                If the same player qualifies through multiple queues, the next
                player from the ranked Best of 3 queue is invited.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</div>
