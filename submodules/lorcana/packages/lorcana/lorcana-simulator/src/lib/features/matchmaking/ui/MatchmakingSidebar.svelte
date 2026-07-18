<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { m } from "$lib/i18n/messages.js";
  import { EYEBROW_CLASS, SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import {
    bulletinArchiveHtml,
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
    <div class="latest-bulletin text-sm leading-7">
      {@html latestBulletinHtml}
    </div>

    <div class="bulletin-archive mt-6 border-t pt-6 text-sm leading-7">
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
  .latest-bulletin :global(h2) {
    color: var(--color-foreground);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1.35;
    margin: 0;
  }

  .latest-bulletin :global(p) {
    color: var(--color-muted-foreground);
    margin-top: 0.75rem;
  }

  .latest-bulletin :global(p:first-of-type) {
    color: var(--color-foreground);
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .bulletin-archive :global(h2) {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted-foreground);
    margin-top: 1rem;
    margin-bottom: 0.25rem;
  }

  .bulletin-archive :global(h2:first-child) {
    margin-top: 0;
  }

  .bulletin-archive :global(p) {
    color: var(--color-muted-foreground);
    margin-top: 0.75rem;
  }

  .bulletin-archive :global(ul) {
    list-style-type: disc;
    margin-inline-start: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bulletin-archive :global(li::marker) {
    color: var(--color-muted-foreground);
  }
</style>
