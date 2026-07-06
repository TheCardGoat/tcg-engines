<script lang="ts">
  import { Badge } from "$lib/design-system/primitives/badge";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { m } from "$lib/i18n/messages.js";
  import { EYEBROW_CLASS, SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import {
    bulletinArchiveHtml,
    communityHighlight,
    latestBulletinHtml,
  } from "../content/right-column-content.js";
  import LeaderboardWidget from "./LeaderboardWidget.svelte";
  import type { LeaderboardResponse } from "../api/leaderboard-api.js";

  interface Props {
    gameProfileId?: string | null;
    initialLeaderboards?: LeaderboardResponse[] | null;
  }

  let { gameProfileId = null, initialLeaderboards = null }: Props = $props();
</script>

<LeaderboardWidget {gameProfileId} initialData={initialLeaderboards} />

<Card class={SURFACE_CARD_CLASS}>
  <CardHeader>
    <p class={EYEBROW_CLASS}>{m["sim.matchmaking.right.bulletin.eyebrow"]({})}</p>
    <CardTitle class="scroll-m-20 text-2xl tracking-tight">
      {m["sim.matchmaking.right.bulletin.title"]({})}
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div class="bulletin-content mb-6 text-sm leading-7">
      {@html latestBulletinHtml}
    </div>

    <section
      class="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 shadow-sm"
      aria-label="Attack of the Vine early access queue announcement"
    >
      <div class="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          class="rounded-full border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200"
        >
          Early access
        </Badge>
        <span class="text-xs font-medium text-muted-foreground">July 3, 2026</span>
      </div>

      <div class="mt-3 space-y-2">
        <h2 class="text-base font-semibold text-foreground">
          Attack of the Vine! all cards are available
        </h2>
        <p class="text-sm leading-6 text-muted-foreground">
          We opened the early access queue so you can test every new Set 13 card before the
          standard rotation changes.
        </p>
      </div>
    </section>

    <div class="bulletin-content text-sm leading-7">
      {@html bulletinArchiveHtml}
    </div>
  </CardContent>
</Card>


<!--<Card class={SURFACE_CARD_CLASS}>-->
<!--  <CardHeader>-->
<!--    <p class={EYEBROW_CLASS}>{m["sim.matchmaking.right.community.eyebrow"]({})}</p>-->
<!--    <CardTitle class="scroll-m-20 text-2xl tracking-tight">-->
<!--      {communityHighlight.title}-->
<!--    </CardTitle>-->
<!--    <CardDescription class="leading-7">-->
<!--      {communityHighlight.body}-->
<!--    </CardDescription>-->
<!--  </CardHeader>-->
<!--  <CardContent class="flex flex-wrap gap-2">-->
<!--    {#each communityHighlight.chips as chip}-->
<!--      <Badge variant="outline">{chip}</Badge>-->
<!--    {/each}-->
<!--  </CardContent>-->
<!--</Card>-->

<style>
  .bulletin-content :global(h2) {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted-foreground);
    margin-top: 1rem;
    margin-bottom: 0.25rem;
  }

  .bulletin-content :global(h2:first-child) {
    margin-top: 0;
  }

  .bulletin-content :global(ul) {
    list-style-type: disc;
    margin-inline-start: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bulletin-content :global(li::marker) {
    color: var(--color-muted-foreground);
  }
</style>
