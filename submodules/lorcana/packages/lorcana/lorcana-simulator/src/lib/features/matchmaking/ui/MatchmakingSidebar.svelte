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
    bulletinHtml,
    communityHighlight,
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
    <div class="bulletin-content text-sm leading-7">
      {@html bulletinHtml}
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
