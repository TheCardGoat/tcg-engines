<script lang="ts">
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import {
    Card,
    CardContent,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { m } from "$lib/i18n/messages.js";
  import type {
    MatchmakingEngagementEventSummary,
    MatchmakingEngagementState,
  } from "@/features/matchmaking/api/player-context-api.js";
  import { joinMatchmakingEngagementEvent } from "@/features/matchmaking/api/player-context-api.js";
  import { EYEBROW_CLASS, SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import Coins from "@lucide/svelte/icons/coins";
  import PartyPopper from "@lucide/svelte/icons/party-popper";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Trophy from "@lucide/svelte/icons/trophy";
  import X from "@lucide/svelte/icons/x";

  interface Props {
    initialState: MatchmakingEngagementState | null;
  }

  let { initialState }: Props = $props();

  let hydratedEngagement = $state<MatchmakingEngagementState | null>(null);
  let joinPendingEventId = $state<string | null>(null);
  let joinError = $state<string | null>(null);
  let dismissedEventIds = $state<Set<string>>(new Set());

  const engagement = $derived(hydratedEngagement ?? initialState);
  const featuredEvent = $derived(engagement?.featuredEvent ?? engagement?.activeEvents[0] ?? null);
  const featuredRulesUrl = $derived(
    featuredEvent ? sanitizeExternalUrl(featuredEvent.rulesUrl) : null,
  );
  const pastWinnersUrl = $derived(`/matchmaking/events`);
  const overflowEvents = $derived(
    engagement?.activeEvents.filter((event) => event.eventId !== featuredEvent?.eventId) ?? [],
  );

  const winnerEvent = $derived(
    [...(engagement?.activeEvents ?? []), ...(engagement?.featuredEvent ? [engagement.featuredEvent] : [])].find(
      (e) => e.hasCurrentUserWon && !dismissedEventIds.has(e.eventId),
    ) ?? null,
  );

  function dismissWinner(eventId: string): void {
    dismissedEventIds = new Set([...dismissedEventIds, eventId]);
  }

  function formatWeekLabel(startsAt: string, endsAt: string): string {
    const fmt = (iso: string) =>
      new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(iso));
    return `${fmt(startsAt)} - ${fmt(endsAt)}`;
  }

  function formatRelativeDeadline(iso: string): string {
    const target = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const totalMinutes = Math.floor(diff / 60_000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return m["sim.matchmaking.engagement.deadline.daysHours"]({ days, hours });
    }
    if (hours > 0) {
      return m["sim.matchmaking.engagement.deadline.hoursMinutes"]({ hours, minutes });
    }
    return m["sim.matchmaking.engagement.deadline.minutes"]({ minutes });
  }

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  }

  function modeLabels(event: MatchmakingEngagementEventSummary): string[] {
    const labels: string[] = [];

    for (const matchType of event.eligibleMatchTypes) {
      labels.push(
        matchType === "ranked"
          ? m["sim.matchmaking.engagement.mode.ranked"]({})
          : m["sim.matchmaking.engagement.mode.casual"]({}),
      );
    }
    for (const mode of event.eligibleModes) {
      labels.push(
        mode === "3"
          ? m["sim.matchmaking.engagement.mode.bo3"]({})
          : m["sim.matchmaking.engagement.mode.bo1"]({}),
      );
    }

    return labels;
  }

  function isMultiWeekEvent(event: MatchmakingEngagementEventSummary): boolean {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return new Date(event.endsAt).getTime() - new Date(event.startsAt).getTime() > msPerWeek;
  }

  function progressPercent(event: MatchmakingEngagementEventSummary): number {
    if (
      isMultiWeekEvent(event) &&
      event.eventCapPoints !== null &&
      event.eventCapPoints > 0
    ) {
      return Math.min(100, Math.round((event.pointsEarned / event.eventCapPoints) * 100));
    }
    if (event.weeklyCapPoints !== null && event.weeklyCapPoints > 0) {
      return Math.min(100, Math.round((event.weeklyPoints / event.weeklyCapPoints) * 100));
    }
    if (event.eventCapPoints !== null && event.eventCapPoints > 0) {
      return Math.min(100, Math.round((event.pointsEarned / event.eventCapPoints) * 100));
    }
    if (event.dailyCapPoints !== null && event.dailyCapPoints > 0) {
      return Math.min(100, Math.round((event.dailyPoints / event.dailyCapPoints) * 100));
    }
    return 0;
  }

  function progressLabel(event: MatchmakingEngagementEventSummary): string {
    if (isMultiWeekEvent(event) && event.eventCapPoints !== null) {
      return m["sim.matchmaking.engagement.progress.event"]({
        current: event.pointsEarned,
        cap: event.eventCapPoints,
      });
    }
    if (event.weeklyCapPoints !== null) {
      return m["sim.matchmaking.engagement.progress.weekly"]({
        current: event.weeklyPoints,
        cap: event.weeklyCapPoints,
      });
    }
    if (event.eventCapPoints !== null) {
      return m["sim.matchmaking.engagement.progress.event"]({
        current: event.pointsEarned,
        cap: event.eventCapPoints,
      });
    }
    if (event.dailyCapPoints !== null) {
      return m["sim.matchmaking.engagement.progress.daily"]({
        current: event.dailyPoints,
        cap: event.dailyCapPoints,
      });
    }
    return m["sim.matchmaking.engagement.progress.earned"]({
      points: event.pointsEarned,
    });
  }

  function secondaryProgressLabel(event: MatchmakingEngagementEventSummary): string | null {
    if (!isMultiWeekEvent(event) || event.weeklyCapPoints === null) {
      return null;
    }
    return m["sim.matchmaking.engagement.progress.weekly"]({
      current: event.weeklyPoints,
      cap: event.weeklyCapPoints,
    });
  }

  function rewardCopy(event: MatchmakingEngagementEventSummary): string {
    if (!event.nextRewardPreview) {
      return event.rewardType === "giveaway_draw"
        ? m["sim.matchmaking.engagement.reward.defaultGiveaway"]({})
        : m["sim.matchmaking.engagement.reward.defaultCatalog"]({});
    }

    if (event.rewardType === "catalog_redemption" && event.nextRewardPreview.pointsCost !== null) {
      const remaining = Math.max(0, event.nextRewardPreview.pointsCost - event.pointsEarned);
      return remaining > 0
        ? m["sim.matchmaking.engagement.reward.moreToUnlock"]({
            remaining,
            rewardTitle: event.nextRewardPreview.title,
          })
        : m["sim.matchmaking.engagement.reward.readyToRedeem"]({
            rewardTitle: event.nextRewardPreview.title,
          });
    }

    return m["sim.matchmaking.engagement.reward.featuredPrize"]({
      rewardTitle: event.nextRewardPreview.title,
    });
  }

  function capSummary(event: MatchmakingEngagementEventSummary): string | null {
    const parts: string[] = [];

    if (event.dailyCapPoints !== null) {
      parts.push(m["sim.matchmaking.engagement.cap.day"]({ cap: event.dailyCapPoints }));
    }
    if (event.weeklyCapPoints !== null) {
      parts.push(m["sim.matchmaking.engagement.cap.week"]({ cap: event.weeklyCapPoints }));
    }
    if (event.eventCapPoints !== null) {
      parts.push(m["sim.matchmaking.engagement.cap.total"]({ cap: event.eventCapPoints }));
    }

    return parts.length > 0 ? parts.join(" · ") : null;
  }

  function remainingSummary(event: MatchmakingEngagementEventSummary): string | null {
    const parts: string[] = [];

    if (event.remainingDailyPoints !== null) {
      parts.push(
        m["sim.matchmaking.engagement.remaining.today"]({
          points: event.remainingDailyPoints,
        }),
      );
    }
    if (event.remainingWeeklyPoints !== null) {
      parts.push(
        m["sim.matchmaking.engagement.remaining.week"]({
          points: event.remainingWeeklyPoints,
        }),
      );
    }
    if (event.remainingEventPoints !== null) {
      parts.push(
        m["sim.matchmaking.engagement.remaining.event"]({
          points: event.remainingEventPoints,
        }),
      );
    }

    return parts.length > 0 ? parts.join(" · ") : null;
  }

  function catchUpCopy(event: MatchmakingEngagementEventSummary): string | null {
    if (
      event.dailyCapPoints !== null &&
      event.weeklyCapPoints !== null &&
      event.weeklyCapPoints > event.dailyCapPoints
    ) {
      return m["sim.matchmaking.engagement.catchUp"]({});
    }

    return null;
  }

  function capStatLine(event: MatchmakingEngagementEventSummary): string | null {
    const parts: string[] = [];

    if (event.dailyCapPoints !== null) {
      const used = event.dailyCapPoints - (event.remainingDailyPoints ?? 0);
      parts.push(`Daily Limit ${used}/${event.dailyCapPoints}`);
    }
    // if (event.weeklyCapPoints !== null) {
    //   const used = event.weeklyCapPoints - (event.remainingWeeklyPoints ?? 0);
    //   parts.push(`Week ${used}/${event.weeklyCapPoints}`);
    // }
    // if (event.eventCapPoints !== null) {
    //   const used = event.eventCapPoints - (event.remainingEventPoints ?? 0);
    //   parts.push(`Event ${used}/${event.eventCapPoints}`);
    // }

    return parts.length > 0 ? parts.join(" · ") : null;
  }

  function sanitizeExternalUrl(url: string | null): string | null {
    if (!url) {
      return null;
    }

    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:"
        ? parsed.toString()
        : null;
    } catch {
      return null;
    }
  }

  async function joinEvent(eventId: string): Promise<void> {
    joinPendingEventId = eventId;
    joinError = null;

    try {
      hydratedEngagement = await joinMatchmakingEngagementEvent(eventId);
    } catch (error) {
      joinError =
        error instanceof Error
          ? error.message
          : m["sim.matchmaking.engagement.error.join"]({});
    } finally {
      joinPendingEventId = null;
    }
  }
</script>

{#if !engagement || engagement.activeEvents.length === 0}
  <Card class={SURFACE_CARD_CLASS}>
    <CardHeader>
      <div class="flex items-center gap-2 text-slate-200">
        <Sparkles class="size-4 text-amber-200" />
        <p class={EYEBROW_CLASS}>{m["sim.matchmaking.engagement.eyebrow"]({})}</p>
      </div>
      <CardTitle class="text-2xl tracking-tight">
        {m["sim.matchmaking.engagement.empty.title"]({})}
      </CardTitle>
      <CardDescription class="leading-7">
        {m["sim.matchmaking.engagement.empty.body"]({})}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <a
        class="text-sm font-medium text-sky-300 underline decoration-sky-400/50 underline-offset-4 hover:text-sky-200"
        href={pastWinnersUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {m["sim.matchmaking.engagement.pastEvents"]({})}
      </a>
    </CardContent>
  </Card>
{:else if featuredEvent}
  <div class="grid gap-4">
    {#if winnerEvent}
      <div class="relative overflow-hidden rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-950/80 via-amber-900/60 to-yellow-950/80 p-5 shadow-lg shadow-amber-500/10">
        <button
          class="absolute right-3 top-3 rounded-full p-1 text-amber-300/70 transition-colors hover:bg-amber-400/20 hover:text-amber-100"
          onclick={() => dismissWinner(winnerEvent.eventId)}
          aria-label={m["sim.matchmaking.engagement.won.dismiss"]({})}
        >
          <X class="size-4" />
        </button>
        <div class="flex items-start gap-4">
          <PartyPopper class="mt-0.5 size-8 shrink-0 text-amber-300" />
          <div class="min-w-0">
            <h3 class="text-xl font-bold text-amber-100">
              {m["sim.matchmaking.engagement.won.title"]({})}
            </h3>
            <p class="mt-2 text-sm leading-6 text-amber-200/90">
              {m["sim.matchmaking.engagement.won.body"]({
                weekLabel: formatWeekLabel(winnerEvent.startsAt, winnerEvent.endsAt),
              })}
            </p>
            {#if winnerEvent.nextRewardPreview}
              <p class="mt-1 text-sm font-medium text-amber-100">
                {m["sim.matchmaking.engagement.won.prize"]({
                  prizeTitle: winnerEvent.nextRewardPreview.title,
                })}
              </p>
            {/if}
            <p class="mt-3 text-sm leading-6 text-amber-300">
              {m["sim.matchmaking.engagement.won.instructions"]({})}
            </p>
          </div>
        </div>
      </div>
    {/if}

    <Card class={SURFACE_CARD_CLASS}>
      <CardHeader>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2 text-slate-200">
            <Sparkles class="size-4 text-amber-200" />
            <p class={EYEBROW_CLASS}>{m["sim.matchmaking.engagement.eyebrow"]({})}</p>
          </div>
          <div class="flex items-center justify-center gap-2">
            <Badge variant="outline" class="text-xs">{formatRelativeDeadline(featuredEvent.endsAt)}</Badge>
            {#if engagement.walletBalance}
              <Badge variant="outline">
                <Coins class="mr-1 size-3.5" />
                {m["sim.matchmaking.engagement.wallet"]({ balance: engagement.walletBalance })}
              </Badge>
            {/if}


            {#if featuredEvent.hasCurrentUserWon}
              <Badge class="border-amber-400/50 bg-amber-400/20 text-amber-200">
                <Trophy class="mr-1 size-3.5" />
                Winner
              </Badge>
            {/if}
          </div>
        </div>
        <CardTitle class="scroll-m-20 text-2xl tracking-tight">
          {featuredEvent.title}
        </CardTitle>
        <CardDescription class="leading-7">
          {featuredEvent.description ?? m["sim.matchmaking.engagement.description.default"]({})}
          {rewardCopy(featuredEvent)}
        </CardDescription>

      </CardHeader>

      <CardContent class="grid">
        {#if featuredEvent.recentOutcome}
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
            <div class="flex items-start gap-2">
              <Trophy class="mt-0.5 size-4 text-amber-300" />
              <div class="min-w-0">
                <p class="font-medium text-white">
                  {m["sim.matchmaking.engagement.winner.latest"]({
                    winner:
                      featuredEvent.recentOutcome.winnerDisplayName ??
                      m["sim.matchmaking.engagement.winner.fallbackName"]({}),
                  })}
                </p>
                <p class="mt-1 text-slate-300">
                  {m["sim.matchmaking.engagement.winner.awardedAt"]({
                    rewardTitle:
                      featuredEvent.recentOutcome.rewardTitle ??
                      m["sim.matchmaking.engagement.winner.rewardFallback"]({}),
                    awardedAt: formatDate(featuredEvent.recentOutcome.awardedAt),
                  })}
                </p>
              </div>
            </div>
          </div>
        {/if}

        <div class="flex flex-wrap items-center">
          {#if featuredEvent.canJoin}
            <Button
              class="h-10 mr-2"
              disabled={joinPendingEventId === featuredEvent.eventId}
              onclick={() => joinEvent(featuredEvent.eventId)}
            >
              {#if joinPendingEventId === featuredEvent.eventId}
                {m["sim.matchmaking.engagement.joining"]({})}
              {:else}
                {m["sim.matchmaking.engagement.join"]({})}
              {/if}
            </Button>
          {/if}

          {#if featuredRulesUrl}
            <a
              class="text-sm font-medium text-sky-300 underline decoration-sky-400/50 underline-offset-4 hover:text-sky-200"
              href={featuredRulesUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {m["sim.matchmaking.engagement.rules"]({})}
            </a>
          {/if}
          <a
            class="text-sm font-medium text-sky-300 underline decoration-sky-400/50 underline-offset-4 hover:text-sky-200"
            href={pastWinnersUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {m["sim.matchmaking.engagement.pastWinners"]({})}
          </a>
        </div>

        {#if joinError}
          <div
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            {joinError}
          </div>
        {/if}
      </CardContent>
      <CardFooter class="grid">
        <div class="grid gap-2">
          <div class="flex items-center justify-between text-sm text-slate-200">
            <span>{progressLabel(featuredEvent)}</span>
            <span>{progressPercent(featuredEvent)}%</span>
          </div>
          <div class="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
                    class="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-cyan-300 transition-[width]"
                    style={`width:${progressPercent(featuredEvent)}%`}
            ></div>
          </div>
          {#if secondaryProgressLabel(featuredEvent)}
            <p class="text-xs text-slate-400">{secondaryProgressLabel(featuredEvent)}</p>
          {/if}
          {#if capStatLine(featuredEvent)}
            <p class="text-xs text-slate-400 text-right">{capStatLine(featuredEvent)}</p>
          {/if}
        </div>
      </CardFooter>
    </Card>

    {#if overflowEvents.length > 0}
      <Card class={SURFACE_CARD_CLASS}>
        <CardHeader>
          <CardTitle class="text-lg tracking-tight">
            {m["sim.matchmaking.engagement.overflow.title"]({})}
          </CardTitle>
          <CardDescription>
            {m["sim.matchmaking.engagement.overflow.body"]({})}
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-3">
          {#each overflowEvents as event}
            <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-medium text-white">{event.title}</p>
                  <p class="mt-1 text-sm text-slate-300">
                    {m["sim.matchmaking.engagement.overflow.pointsEarned"]({
                      points: event.pointsEarned,
                    })}
                  </p>
                </div>
                {#if event.canJoin}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={joinPendingEventId === event.eventId}
                    onclick={() => joinEvent(event.eventId)}
                    class="mr-2"
                  >
                    {joinPendingEventId === event.eventId
                      ? m["sim.matchmaking.engagement.joining"]({})
                      : m["sim.matchmaking.engagement.joinShort"]({})}
                  </Button>
                {:else}
                  <Badge variant="outline">
                    {event.joined
                      ? m["sim.matchmaking.engagement.joined"]({})
                      : m["sim.matchmaking.engagement.overflow.live"]({})}
                  </Badge>
                {/if}
              </div>
            </div>
          {/each}
        </CardContent>
      </Card>
    {/if}
  </div>
{/if}
