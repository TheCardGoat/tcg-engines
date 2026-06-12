<script lang="ts">
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
  import {
    getLorcanaCardTagGroups,
    type LorcanaCardStatBadge,
    type LorcanaCardTag,
  } from "@/design-system/simulator/cards/card-tags.js";
  import CardTagStrip from "@/design-system/simulator/cards/CardTagStrip.svelte";
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";

  interface PlayZoneCardBandsProps {
    card: LorcanaCardSnapshot;
    section: "top" | "bottom";
  }

  let { card, section }: PlayZoneCardBandsProps = $props();

  const tagGroups = $derived(getLorcanaCardTagGroups(card));
  const statBadges = $derived(tagGroups.statBadges);
  // "damage" already surfaces via the center overlay on the card; exclude it.
  const statusTags = $derived<LorcanaCardTag[]>(
    tagGroups.tags.filter((tag) => tag.id !== "damage"),
  );

  function getStatBadgeToneClass(tone: LorcanaCardStatBadge["tone"]): string {
    switch (tone) {
      case "success":
        return "border-emerald-400/35 bg-emerald-500/16 text-emerald-100";
      case "warning":
        return "border-amber-400/35 bg-amber-500/18 text-amber-50";
      default:
        return "border-sky-400/35 bg-sky-500/16 text-sky-100";
    }
  }
</script>

{#if section === "top"}
  <div
    class="card-slot__band card-slot__band--top"
    data-testid="play-zone-status-band"
    aria-hidden={statusTags.length === 0}
  >
    {#if statusTags.length > 0}
      <CardTagStrip
        tags={statusTags}
        maxVisible={4}
        compact
        class="justify-end gap-1"
      />
    {/if}
  </div>
{:else}
  <div
    class="card-slot__band card-slot__band--bottom stats-strip-overlap"
    data-testid="play-zone-stats-band"
    aria-hidden={statBadges.length === 0}
  >
    {#each statBadges as badge (badge.id)}
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <button
              type="button"
              {...props}
              data-testid={`play-zone-stat-badge-${badge.stat}`}
              class={`play-zone-pill relative inline-flex items-center justify-center rounded-full border px-1.5 backdrop-blur-sm ${getStatBadgeToneClass(badge.tone)}`}
              aria-label={badge.label}
              onclick={(event) => event.stopPropagation()}
            >
              <img src={badge.iconUrl} alt="" class="absolute inset-0 m-auto h-full w-full rounded-full opacity-45" />
              <span class="play-zone-pill__value relative font-bold leading-none tabular-nums">
                {badge.currentValue}
              </span>
            </button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          class="rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
        >
          <div class="font-semibold">{badge.label}</div>
        </Tooltip.Content>
      </Tooltip.Root>
    {/each}
  </div>
{/if}

<style>
  .card-slot__band {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    width: 100%;
    padding: 0 0.25rem;
  }

  .card-slot__band[aria-hidden="true"] {
    /* Reserve vertical space even when empty, so slot height is stable
       regardless of stat modifications. */
    visibility: hidden;
  }

  .card-slot__band--top {
    height: var(--play-band-height-top, 2.5rem);
    justify-content: flex-end;
    margin-bottom: calc(var(--play-band-height-top) * var(--play-band-overlap, 0.5) * -1);
  }

  .card-slot__band--bottom {
    height: var(--play-band-height-bottom, 2.5rem);
    justify-content: flex-end;
    margin-top: calc(var(--play-band-height-bottom) * var(--play-band-overlap, 0.5) * -1);
  }

  /* Overlapping stat pills — same rhythm as the top band's CardTagStrip. */
  .stats-strip-overlap > :global(* + *) {
    margin-left: -8px;
  }

  .stats-strip-overlap > :global(*:hover),
  .stats-strip-overlap > :global(*:focus-visible) {
    z-index: 5;
  }

  /* Stat pills size themselves via cascading --play-pill-* vars declared
     on the scroll-area, so they scale with card-art width. */
  .play-zone-pill {
    height: var(--play-pill-size);
    width: var(--play-pill-size);
    min-width: var(--play-pill-size);
  }

  .play-zone-pill__value {
    font-size: var(--play-pill-text-size);
  }

  /* Scale CardTagStrip's compact pills to the same --play-pill-* sizes
     so the top band visually matches the bottom band. */
  .card-slot__band--top :global(.tag-strip-compact > *) {
    height: var(--play-pill-size);
    width: var(--play-pill-size);
    min-width: var(--play-pill-size);
  }

  .card-slot__band--top :global(.tag-strip-compact > * svg) {
    height: var(--play-pill-icon-size);
    width: var(--play-pill-icon-size);
  }

  .card-slot__band--top :global(.tag-strip-compact) {
    align-items: center;
  }
</style>
