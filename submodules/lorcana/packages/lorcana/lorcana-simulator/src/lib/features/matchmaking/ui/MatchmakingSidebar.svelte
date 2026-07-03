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
  import * as HoverCard from "$lib/design-system/primitives/hover-card/index.js";
  import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
  import { EYEBROW_CLASS, SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import {
    bulletinHtml,
    communityHighlight,
  } from "../content/right-column-content.js";
  import LeaderboardWidget from "./LeaderboardWidget.svelte";
  import type { LeaderboardResponse } from "../api/leaderboard-api.js";
  import { all013Cards } from "@tcg/lorcana-cards/cards/013";
  import { getFullName, type LorcanaCard } from "@tcg/lorcana-types";

  type SetPreviewCard = {
    card: LorcanaCard;
    displayName: string;
    collectorNumber: number;
  };

  const set13PreviewCards: SetPreviewCard[] = all013Cards
    .filter((card): card is LorcanaCard & { cardNumber: number } => {
      return (
        card.set === "013" &&
        typeof card.cardNumber === "number" &&
        !card.specialRarity &&
        card.printings.some((printing) => /^set13-\d+$/.test(printing.id))
      );
    })
    .map((card) => ({
      card,
      displayName: getFullName(card),
      collectorNumber: card.cardNumber,
    }))
    .sort((a, b) => a.collectorNumber - b.collectorNumber);

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
          Attack of the Vine! queue is live
        </h2>
        <p class="text-sm leading-6 text-muted-foreground">
          We opened the early access queue so you can test the new Set 13 cards before the
          standard rotation changes. Available cards can be seen below.
        </p>
      </div>

      <div class="mt-4 flex max-h-56 flex-wrap gap-1.5 overflow-y-auto pr-1">
        {#each set13PreviewCards as previewCard (previewCard.card.id)}
          <HoverCard.Root openDelay={120}>
            <HoverCard.Trigger class="inline-flex">
              <button
                type="button"
                class="inline-flex max-w-full cursor-help items-center rounded-full border border-border/80 bg-background/75 px-2.5 py-1 text-left text-xs font-medium text-foreground shadow-xs transition-colors hover:border-emerald-500/35 hover:bg-emerald-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                aria-label={`Preview ${previewCard.displayName}`}
              >
                <span class="truncate">{previewCard.displayName}</span>
              </button>
            </HoverCard.Trigger>
            <HoverCard.Content
              side="left"
              align="start"
              sideOffset={10}
              class="w-[min(15rem,calc(100vw-2rem))] rounded-xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
            >
              <div class="overflow-hidden rounded-lg border border-border bg-muted">
                <CardImage
                  set="013"
                  number={previewCard.collectorNumber}
                  alt={previewCard.displayName}
                  class="rounded-lg"
                />
              </div>
            </HoverCard.Content>
          </HoverCard.Root>
        {/each}
      </div>
    </section>

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
