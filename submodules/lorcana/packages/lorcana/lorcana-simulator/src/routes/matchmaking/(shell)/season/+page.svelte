<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Trophy from "@lucide/svelte/icons/trophy";

  let { data } = $props();
  const formatDate = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium", timeZone: "UTC" })
      : "Open ended";
</script>

<PageMeta title="Lorcana seasons" description="Browse current and completed Lorcana ranked seasons." />

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl pb-12 pt-3">
    <Button variant="ghost" size="sm" href="/matchmaking"><ArrowLeft class="size-4" />Back to matchmaking</Button>
    <header class="mt-5 border-b border-white/10 pb-6">
      <div class="flex items-center gap-2 text-amber-200"><Trophy class="size-4" /><span class="text-xs font-semibold uppercase tracking-[0.18em]">Ranked play</span></div>
      <h1 class="mt-3 text-3xl font-semibold text-slate-100">Lorcana seasons</h1>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Review season details, prize pools, and final standings.</p>
    </header>

    {#if data.seasons.length > 0}
      <div class="mt-7 grid gap-4">
        {#each data.seasons as season (season.slug)}
          <Card class="border-white/10 bg-slate-950/50">
            <CardHeader class="gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  {#if season.isActive}<Badge>Current season</Badge>{:else}<Badge variant="outline">Completed</Badge>{/if}
                  {#if season.isPrimary}<Badge variant="outline">Featured</Badge>{/if}
                </div>
                <CardTitle class="mt-3 text-xl">{season.name}</CardTitle>
                <p class="mt-2 flex items-center gap-2 text-sm text-slate-400"><CalendarDays class="size-4" />{formatDate(season.startsAt)} to {formatDate(season.endsAt)}</p>
              </div>
              <Button href={`/matchmaking/season/${season.slug}`}>View season</Button>
            </CardHeader>
            <CardContent class="text-sm text-slate-400">{season.isActive ? "Prize details and ranked standings are available now." : "View the archived prize pool, timeline, and final standings."}</CardContent>
          </Card>
        {/each}
      </div>
    {:else}
      <Card class="mt-7 border-white/10 bg-slate-950/70"><CardHeader><CardTitle>No seasons are available yet</CardTitle></CardHeader><CardContent class="text-sm text-slate-400">Please check back when the next ranked season is announced.</CardContent></Card>
    {/if}
  </div>
</div>
