<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import {
    EYEBROW_CLASS,
    SURFACE_CARD_CLASS,
  } from "$lib/features/matchmaking/ui/matchmaking-lobby.constants.js";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Calendar from "@lucide/svelte/icons/calendar";
  import Gift from "@lucide/svelte/icons/gift";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Trophy from "@lucide/svelte/icons/trophy";
  import Users from "@lucide/svelte/icons/users";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import Dice5 from "@lucide/svelte/icons/dice-5";
  import HandCoins from "@lucide/svelte/icons/hand-coins";

  let { data }: { data: PageData } = $props();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const shortDate = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });

  function formatRange(startsAt: string, endsAt: string): string {
    return `${shortDate.format(new Date(startsAt))} – ${dateFormatter.format(new Date(endsAt))}`;
  }

  function formatAwarded(iso: string): string {
    return dateFormatter.format(new Date(iso));
  }

  function initials(name: string | null): string {
    if (!name) return "★";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "★";
  }

  function rewardTypeLabel(type: string): string {
    switch (type) {
      case "giveaway_draw":
        return "Giveaway draw";
      case "catalog_redemption":
        return "Catalog redemption";
      case "manual_grant":
        return "Direct grant";
      default:
        return type;
    }
  }

  const hasEvents = $derived(data.events.length > 0);
</script>

<PageMeta
  title={data.seo.title}
  description={data.seo.description}
  canonicalUrl={data.seo.canonicalUrl}
  ogImage={data.seo.ogImage}
/>

<svelte:head>
  <title>{data.seo.title}</title>
</svelte:head>

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-4xl pb-12 pt-2">
    <div class="mb-4 flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        class="text-slate-400 hover:text-slate-200"
        onclick={() => goto("/matchmaking")}
      >
        <ArrowLeft class="size-4" />
      </Button>
      <h1 class="text-lg font-semibold tracking-tight text-slate-100">
        Hall of Fame
      </h1>
    </div>

    <section
      class="relative mb-6 overflow-hidden rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-950/40 via-slate-950/80 to-sky-950/40 p-6 sm:p-8"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.14),transparent_45%)]"
        aria-hidden="true"
      ></div>
      <div class="relative">
        <div class="flex items-center gap-2 text-amber-200">
          <Sparkles class="size-4" />
          <p class={EYEBROW_CLASS}>Past winners</p>
        </div>
        <h2
          class="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl"
        >
          Real prizes. Real winners. Every time.
        </h2>
        <p class="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
          Every event we run is logged here — the prize, the date it was awarded,
          and the player who walked away with it. No fine print, no vanishing
          rewards. Play with confidence.
        </p>

        {#if hasEvents}
          <dl
            class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
            aria-label="Community prize totals"
          >
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Events
              </dt>
              <dd class="mt-1 text-2xl font-bold text-slate-50 tabular-nums sm:text-3xl">
                {data.stats.totalEvents}
              </dd>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Prizes
              </dt>
              <dd class="mt-1 text-2xl font-bold text-amber-200 tabular-nums sm:text-3xl">
                {data.stats.totalPrizes}
              </dd>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Winners
              </dt>
              <dd class="mt-1 text-2xl font-bold text-amber-200 tabular-nums sm:text-3xl">
                {data.stats.totalWinners}
              </dd>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Players
              </dt>
              <dd class="mt-1 text-2xl font-bold text-slate-50 tabular-nums sm:text-3xl">
                {data.stats.totalParticipants}
              </dd>
            </div>
          </dl>
        {/if}
      </div>
    </section>

    {#if data.recentWinners.length > 0}
      <section class="mb-8">
        <div class="mb-3 flex items-center gap-2 text-slate-200">
          <Trophy class="size-4 text-amber-300" />
          <p class={EYEBROW_CLASS}>Latest winners</p>
        </div>
        <div
          class="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {#each data.recentWinners as winner (winner.outcomeId)}
            <div
              class="flex w-[240px] shrink-0 flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.9)] backdrop-blur-sm"
            >
              <div class="flex items-center gap-2.5">
                <Avatar class="size-9 border border-amber-300/30">
                  {#if winner.avatarUrl}
                    <AvatarImage
                      src={winner.avatarUrl}
                      alt={winner.displayName ?? "Anonymous player"}
                    />
                  {/if}
                  <AvatarFallback
                    class="bg-amber-300/15 text-xs font-semibold text-amber-200"
                  >
                    {initials(winner.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-100">
                    {winner.displayName ?? "Anonymous player"}
                  </p>
                  <p class="truncate text-[11px] text-slate-500">
                    {formatAwarded(winner.awardedAt)}
                  </p>
                </div>
              </div>
              <div class="rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-2.5 py-2">
                <p class="line-clamp-2 text-xs font-medium text-amber-100">
                  {winner.prizeTitle}
                </p>
                <p class="mt-0.5 truncate text-[11px] text-slate-400">
                  {winner.eventTitle}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <section class="mb-8">
      <div class="mb-3 flex items-center gap-2 text-slate-200">
        <Gift class="size-4 text-sky-300" />
        <p class={EYEBROW_CLASS}>Every event, every prize</p>
      </div>

      {#if !hasEvents}
        <Card class={SURFACE_CARD_CLASS}>
          <CardContent class="flex flex-col items-center justify-center py-14 text-center">
            <div
              class="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-300/10"
            >
              <Trophy class="size-6 text-amber-300" />
            </div>
            <h3 class="text-base font-semibold text-slate-100">
              The first winner is coming soon
            </h3>
            <p class="mt-2 max-w-sm text-sm text-slate-400">
              Past events and the players who won them will appear here once our
              first giveaway wraps up. Stay tuned.
            </p>
          </CardContent>
        </Card>
      {:else}
        <div class="flex flex-col gap-4">
          {#each data.events as event (event.eventId)}
            <Card class={SURFACE_CARD_CLASS}>
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="mb-1 flex flex-wrap items-center gap-2">
                      <CardTitle class="text-xl text-slate-100">
                        {event.title}
                      </CardTitle>
                      {#if event.featured}
                        <Badge
                          class="border-amber-400/40 bg-amber-400/15 text-amber-200"
                        >
                          Featured
                        </Badge>
                      {/if}
                    </div>
                    <CardDescription
                      class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400"
                    >
                      <span class="flex items-center gap-1.5">
                        <Calendar class="size-3.5" aria-hidden="true" />
                        {formatRange(event.startsAt, event.endsAt)}
                      </span>
                      <span
                        class="flex items-center gap-1.5"
                        aria-label="Participants"
                      >
                        <Users class="size-3.5" aria-hidden="true" />
                        {event.participants} players
                      </span>
                    </CardDescription>
                  </div>
                </div>
                {#if event.description}
                  <p class="mt-2 text-sm text-slate-300">{event.description}</p>
                {/if}
              </CardHeader>

              <CardContent class="pt-0">
                {#if event.prizes.length === 0}
                  <p class="text-sm italic text-slate-500">
                    No prizes were awarded for this event.
                  </p>
                {:else}
                  <ul class="flex flex-col gap-2.5">
                    {#each event.prizes as prize (prize.rewardId)}
                      <li
                        class="rounded-xl border border-white/10 bg-white/[0.025] p-3"
                      >
                        <div
                          class="flex flex-wrap items-start justify-between gap-2"
                        >
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <Gift
                                class="size-4 shrink-0 text-amber-300"
                                aria-hidden="true"
                              />
                              <span class="font-semibold text-slate-100">
                                {prize.title}
                              </span>
                              {#if prize.winnerCount > 1}
                                <Badge
                                  variant="outline"
                                  class="border-white/15 text-[10px] text-slate-300"
                                >
                                  {prize.winnerCount} winners
                                </Badge>
                              {/if}
                              <Badge
                                variant="outline"
                                class="border-white/10 text-[10px] uppercase tracking-wide text-slate-400"
                              >
                                {rewardTypeLabel(prize.type)}
                              </Badge>
                            </div>
                            {#if prize.description}
                              <p class="mt-1 pl-6 text-xs text-slate-400">
                                {prize.description}
                              </p>
                            {/if}
                          </div>
                          {#if prize.winners.length === 0}
                            <Badge
                              variant="secondary"
                              class="bg-slate-700/60 text-[10px] text-slate-300"
                            >
                              Draw pending
                            </Badge>
                          {:else if prize.winners.length < prize.winnerCount}
                            <Badge
                              variant="secondary"
                              class="bg-slate-700/60 text-[10px] text-slate-300"
                            >
                              {prize.winners.length}/{prize.winnerCount} drawn
                            </Badge>
                          {/if}
                        </div>

                        {#if prize.winners.length > 0}
                          <ul
                            class="mt-3 flex flex-wrap gap-2"
                            aria-label="Prize winners"
                          >
                            {#each prize.winners as winner (winner.outcomeId)}
                              <li
                                class="group flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.06] py-1 pl-1 pr-3 transition-colors hover:border-amber-300/50 hover:bg-amber-300/[0.1]"
                              >
                                <Avatar class="size-7 border border-amber-300/30">
                                  {#if winner.avatarUrl}
                                    <AvatarImage
                                      src={winner.avatarUrl}
                                      alt={winner.displayName ?? "Anonymous player"}
                                    />
                                  {/if}
                                  <AvatarFallback
                                    class="bg-amber-300/20 text-[10px] font-semibold text-amber-200"
                                  >
                                    {initials(winner.displayName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div class="flex min-w-0 flex-col leading-tight">
                                  <span
                                    class="truncate text-xs font-semibold text-amber-100"
                                  >
                                    {winner.displayName ?? "Anonymous player"}
                                  </span>
                                  <span class="text-[10px] text-amber-200/60">
                                    {formatAwarded(winner.awardedAt)}
                                  </span>
                                </div>
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                {/if}
              </CardContent>
            </Card>
          {/each}
        </div>
      {/if}
    </section>

<!--    <section-->
<!--      class="rounded-2xl border border-white/10 bg-slate-950/60 p-5 sm:p-6"-->
<!--    >-->
<!--      <div class="mb-4 flex items-center gap-2 text-slate-200">-->
<!--        <ShieldCheck class="size-4 text-emerald-300" />-->
<!--        <p class={EYEBROW_CLASS}>How prizing works</p>-->
<!--      </div>-->
<!--      <div class="grid gap-4 sm:grid-cols-3">-->
<!--        <div class="flex gap-3">-->
<!--          <Dice5 class="mt-0.5 size-5 shrink-0 text-emerald-300" />-->
<!--          <div>-->
<!--            <p class="text-sm font-semibold text-slate-100">Random and fair</p>-->
<!--            <p class="mt-1 text-xs leading-5 text-slate-400">-->
<!--              Giveaway draws are randomized across every eligible player. No-->
<!--              hand-picked winners.-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="flex gap-3">-->
<!--          <ShieldCheck class="mt-0.5 size-5 shrink-0 text-emerald-300" />-->
<!--          <div>-->
<!--            <p class="text-sm font-semibold text-slate-100">Public ledger</p>-->
<!--            <p class="mt-1 text-xs leading-5 text-slate-400">-->
<!--              Every prize and winner is logged here permanently. Nothing-->
<!--              disappears, nothing is hidden.-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="flex gap-3">-->
<!--          <HandCoins class="mt-0.5 size-5 shrink-0 text-emerald-300" />-->
<!--          <div>-->
<!--            <p class="text-sm font-semibold text-slate-100">Direct fulfillment</p>-->
<!--            <p class="mt-1 text-xs leading-5 text-slate-400">-->
<!--              Winners are contacted directly and prizes are shipped or credited-->
<!--              within days, not weeks.-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->
  </div>
</div>
