<script lang="ts">
  import type { PageData } from "./$types";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { Separator } from "$lib/components/ui/separator";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import EmptyState from "$lib/components/tracker/EmptyState.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import { Gift, Trophy, Users, Calendar } from "@lucide/svelte";

  let { data }: { data: PageData } = $props();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function formatRange(startsAt: string, endsAt: string): string {
    return `${dateFormatter.format(new Date(startsAt))} – ${dateFormatter.format(new Date(endsAt))}`;
  }

  function initials(name: string | null): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
  }
</script>

<PageMeta
  title={data.seo.title}
  description={data.seo.description}
  canonicalUrl={data.seo.canonicalUrl}
  ogImage={data.seo.ogImage}
/>

<div class="container mx-auto px-4 py-8 max-w-5xl">
  <header class="mb-10 text-center">
    <h1 class="text-3xl sm:text-4xl font-bold mb-3">{m.events_page_title()}</h1>
    <p class="text-muted-foreground max-w-2xl mx-auto">
      {m.events_page_subtitle()}
    </p>
  </header>

  {#if data.events.length > 0}
    <section
      class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 p-5 rounded-lg bg-muted/50"
      aria-label={m.events_stats_aria()}
    >
      <div class="text-center">
        <div class="text-2xl sm:text-3xl font-bold text-primary">{data.stats.totalEvents}</div>
        <div class="text-xs sm:text-sm text-muted-foreground mt-1">
          {m.events_stats_events()}
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl sm:text-3xl font-bold text-primary">{data.stats.totalPrizes}</div>
        <div class="text-xs sm:text-sm text-muted-foreground mt-1">
          {m.events_stats_prizes()}
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl sm:text-3xl font-bold text-primary">{data.stats.totalWinners}</div>
        <div class="text-xs sm:text-sm text-muted-foreground mt-1">
          {m.events_stats_winners()}
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl sm:text-3xl font-bold text-primary">
          {data.stats.totalParticipants}
        </div>
        <div class="text-xs sm:text-sm text-muted-foreground mt-1">
          {m.events_stats_participants()}
        </div>
      </div>
    </section>
  {/if}

  {#if data.events.length === 0}
    <EmptyState
      title={m.events_empty_title()}
      description={m.events_empty_description()}
    />
  {:else}
    <div class="flex flex-col gap-5">
      {#each data.events as event (event.eventId)}
        <Card class="overflow-hidden">
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <CardTitle class="text-xl">{event.title}</CardTitle>
                  {#if event.featured}
                    <Badge variant="default" class="text-xs">
                      {m.events_badge_featured()}
                    </Badge>
                  {/if}
                  <Badge variant="outline" class="text-xs uppercase tracking-wide">
                    {event.gameSlug}
                  </Badge>
                </div>
                <CardDescription class="flex items-center gap-1.5 text-xs">
                  <Calendar class="h-3.5 w-3.5" aria-hidden="true" />
                  {formatRange(event.startsAt, event.endsAt)}
                </CardDescription>
              </div>
              <div
                class="flex items-center gap-1.5 text-sm text-muted-foreground"
                aria-label={m.events_participants_aria()}
              >
                <Users class="h-4 w-4" aria-hidden="true" />
                <span>{event.participants}</span>
              </div>
            </div>
            {#if event.description}
              <p class="text-sm text-muted-foreground mt-2">{event.description}</p>
            {/if}
          </CardHeader>

          <CardContent class="pt-0">
            <Separator class="mb-4" />
            <h3
              class="flex items-center gap-1.5 text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide"
            >
              <Gift class="h-4 w-4" aria-hidden="true" />
              {event.prizes.length === 1
                ? m.events_prizes_heading_singular()
                : m.events_prizes_heading_plural()}
            </h3>
            {#if event.prizes.length === 0}
              <p class="text-sm text-muted-foreground italic">
                {m.events_prizes_none()}
              </p>
            {:else}
              <ul class="flex flex-col gap-3">
                {#each event.prizes as prize (prize.rewardId)}
                  <li class="flex flex-col gap-3 p-3 rounded-md border bg-card/50">
                    <div class="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-medium text-sm">{prize.title}</span>
                          {#if prize.winnerCount > 1}
                            <Badge variant="outline" class="text-xs">
                              {m.events_prize_winner_count({ count: prize.winnerCount })}
                            </Badge>
                          {/if}
                        </div>
                        {#if prize.description}
                          <div class="text-xs text-muted-foreground mt-0.5">
                            {prize.description}
                          </div>
                        {/if}
                      </div>
                      {#if prize.winners.length === 0}
                        <Badge variant="secondary" class="text-xs shrink-0">
                          {m.events_winner_pending()}
                        </Badge>
                      {:else if prize.winners.length < prize.winnerCount}
                        <Badge variant="secondary" class="text-xs shrink-0">
                          {m.events_winner_partial({
                            drawn: prize.winners.length,
                            total: prize.winnerCount,
                          })}
                        </Badge>
                      {/if}
                    </div>
                    {#if prize.winners.length > 0}
                      <ul
                        class="flex flex-wrap gap-2"
                        aria-label={m.events_winner_aria()}
                      >
                        {#each prize.winners as winner (winner.outcomeId)}
                          <li
                            class="flex items-center gap-2 px-2 py-1 rounded-md bg-background border"
                          >
                            <Trophy class="h-4 w-4 text-amber-500" aria-hidden="true" />
                            <Avatar class="h-7 w-7">
                              {#if winner.avatarUrl}
                                <AvatarImage
                                  src={winner.avatarUrl}
                                  alt={winner.displayName ?? m.events_winner_anonymous()}
                                />
                              {/if}
                              <AvatarFallback class="text-xs">
                                {initials(winner.displayName)}
                              </AvatarFallback>
                            </Avatar>
                            <span class="text-sm font-medium">
                              {winner.displayName ?? m.events_winner_anonymous()}
                            </span>
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
</div>
