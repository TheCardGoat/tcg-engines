<script lang="ts">
  import { untrack } from "svelte";
  import {
    ChevronDown,
    CircleHelp,
    Clock3,
    Droplets,
    Flag,
    MapPinned,
    OctagonX,
    PauseCircle,
    Play,
    ScrollText,
    Swords,
    WandSparkles,
  } from "@lucide/svelte";
  import { m } from "$lib/i18n/messages.js";
  import { Badge } from "$lib/design-system/primitives/badge";
  import CardLogToken from "@/features/simulator/panels/CardLogToken.svelte";
  import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
  import type {
    PostGameActorTone,
    PostGameTimelineIconId,
    PostGameTurnSummary,
  } from "./types.js";

  interface PostGameTimelineSectionProps {
    turns: PostGameTurnSummary[];
    totalLogEntries: number;
    viewerSide?: LorcanaPlayerSide | null;
    initialExpandedTurnNumbers?: number[];
    defaultTechnicalTurnNumbers?: number[];
  }

  type TurnCategorySummary = {
    id: string;
    label: string;
    iconId: PostGameTimelineIconId;
    count: number;
  };

  let {
    turns,
    totalLogEntries,
    viewerSide = null,
    initialExpandedTurnNumbers = [],
    defaultTechnicalTurnNumbers = [],
  }: PostGameTimelineSectionProps = $props();

  let expandedTurns = $state<Set<number>>(new Set(untrack(() => initialExpandedTurnNumbers)));
  let technicalTurns = $state<Set<number>>(new Set(untrack(() => defaultTechnicalTurnNumbers)));

  function formatClock(timestamp: number): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  function formatDuration(durationMs: number): string {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function getSideLabel(side: LorcanaPlayerSide | null): string {
    if (!side) {
      return m["sim.postGame.result.unknownPlayer"]({});
    }

    if (viewerSide && side === viewerSide) {
      return m["sim.player.you"]({});
    }

    if (viewerSide && side !== viewerSide) {
      return m["sim.player.opponent"]({});
    }

    return side === "playerOne"
      ? m["sim.player.side.playerOne"]({})
      : m["sim.player.side.playerTwo"]({});
  }

  function toggleTurn(turnNumber: number): void {
    const nextExpandedTurns = new Set(expandedTurns);
    if (nextExpandedTurns.has(turnNumber)) {
      nextExpandedTurns.delete(turnNumber);
    } else {
      nextExpandedTurns.add(turnNumber);
    }

    expandedTurns = nextExpandedTurns;
  }

  function toggleTechnical(turnNumber: number): void {
    const nextTechnicalTurns = new Set(technicalTurns);
    if (nextTechnicalTurns.has(turnNumber)) {
      nextTechnicalTurns.delete(turnNumber);
    } else {
      nextTechnicalTurns.add(turnNumber);
    }

    technicalTurns = nextTechnicalTurns;
  }

  function isTurnExpanded(turnNumber: number): boolean {
    return expandedTurns.has(turnNumber);
  }

  function hasTechnicalDetails(turnNumber: number): boolean {
    return technicalTurns.has(turnNumber);
  }

  function groupActorTextClasses(tone: PostGameActorTone): string {
    switch (tone) {
      case "self":
        return "post-game-actor--self";
      case "opponent":
        return "post-game-actor--opponent";
      case "playerOne":
        return "post-game-actor--player-one";
      case "playerTwo":
        return "post-game-actor--player-two";
      case "system":
        return "post-game-actor--system";
    }
  }

  function actorToneFromSide(side: LorcanaPlayerSide | null): PostGameActorTone {
    if (!side) {
      return "system";
    }

    if (viewerSide && side === viewerSide) {
      return "self";
    }

    if (viewerSide && side !== viewerSide) {
      return "opponent";
    }

    return side;
  }

  function moveToneClass(iconId: PostGameTimelineIconId): string {
    switch (iconId) {
      case "ink-card":
        return "post-game-tone--ink";
      case "quest":
      case "quest-all":
        return "post-game-tone--quest";
      case "challenge":
        return "post-game-tone--challenge";
      case "activate-ability":
        return "post-game-tone--ability";
      case "move-to-location":
        return "post-game-tone--move";
      case "pass-turn":
        return "post-game-tone--pass";
      case "concede":
        return "post-game-tone--concede";
      case "play-card":
      case "shift-card":
      case "sing-card":
        return "post-game-tone--play";
      default:
        return "post-game-tone--system";
    }
  }

  function timelineIcon(iconId: PostGameTimelineIconId) {
    switch (iconId) {
      case "ink-card":
        return Droplets;
      case "quest":
      case "quest-all":
        return Flag;
      case "challenge":
        return Swords;
      case "activate-ability":
        return WandSparkles;
      case "move-to-location":
        return MapPinned;
      case "pass-turn":
        return PauseCircle;
      case "concede":
        return OctagonX;
      case "play-card":
      case "shift-card":
      case "sing-card":
        return Play;
      default:
        return CircleHelp;
    }
  }

  function getTurnCategorySummaries(turn: PostGameTurnSummary): TurnCategorySummary[] {
    const grouped = new Map<string, TurnCategorySummary>();

    for (const action of turn.actions) {
      const key = action.moveCategoryId;
      const existing = grouped.get(key);
      if (existing) {
        existing.count += 1;
        continue;
      }

      grouped.set(key, {
        id: key,
        label: action.moveCategoryLabel,
        iconId: action.timelineIconId,
        count: 1,
      });
    }

    return [...grouped.values()].sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.label.localeCompare(right.label);
    });
  }
</script>

<section class="post-game-panel">
  <header class="post-game-panel__header">
    <div>
      <h3>{m["sim.postGame.timeline.title"]({})}</h3>
      <p>{m["sim.postGame.timeline.description"]({ entries: totalLogEntries })}</p>
    </div>
  </header>

  {#if turns.length === 0}
    <div class="post-game-empty-card">
      {m["sim.postGame.timeline.empty"]({})}
    </div>
  {:else}
    <div class="post-game-timeline" data-testid="post-game-timeline">
      {#each turns as turn (turn.id)}
        {@const expanded = isTurnExpanded(turn.turnNumber)}
        {@const showTechnical = hasTechnicalDetails(turn.turnNumber)}
        <article class="post-game-turn" data-testid={`timeline-turn-${turn.turnNumber}`}>
          <button
            type="button"
            class="post-game-turn__header"
            aria-expanded={expanded}
            onclick={() => toggleTurn(turn.turnNumber)}
          >
            <div class="post-game-turn__summary">
              <div class="post-game-turn__summary-line">
                <Badge variant="outline">
                  {m["sim.postGame.turn"]({ turn: turn.turnNumber })}
                </Badge>
                <span class={`post-game-inline-chip ${groupActorTextClasses(actorToneFromSide(turn.actorSide))}`}>
                  {getSideLabel(turn.actorSide)}
                </span>
              </div>
              <h4>{getSideLabel(turn.actorSide)}</h4>
              <p>
                {m["sim.postGame.timeline.durationValue"]({ duration: formatDuration(turn.durationMs) })}
                ·
                {m["sim.postGame.timeline.actionCount"]({ count: turn.moveCount })}
              </p>
            </div>

            <div class="post-game-turn__meta">
              <div class="post-game-turn__categories">
                {#each getTurnCategorySummaries(turn) as category (category.id)}
                  {@const CategoryIcon = timelineIcon(category.iconId)}
                  <span
                    class={`post-game-category-chip ${moveToneClass(category.iconId)}`}
                    data-move-category={category.id}
                  >
                    <CategoryIcon class="size-3.5" />
                    <span>{category.count}</span>
                  </span>
                {/each}
              </div>
              <span class="post-game-turn__chevron" class:post-game-turn__chevron--expanded={expanded}>
                <ChevronDown class="size-4" />
              </span>
            </div>
          </button>

          {#if expanded}
            <div class="post-game-turn__body">
              <div class="post-game-turn__toolbar">
                <button
                  type="button"
                  class="post-game-turn__technical-toggle"
                  onclick={() => toggleTechnical(turn.turnNumber)}
                >
                  {showTechnical
                    ? m["sim.postGame.timeline.hideTechnical"]({})
                    : m["sim.postGame.timeline.showTechnical"]({})}
                </button>
              </div>

              <div class="post-game-action-list">
                {#each turn.actions as action (action.id)}
                  {@const ActionIcon = timelineIcon(action.timelineIconId)}
                  <article
                    class="post-game-action"
                    data-testid={`timeline-action-${action.id}`}
                    data-move-category={action.moveCategoryId}
                  >
                    <div
                      class={`post-game-action__icon ${moveToneClass(action.timelineIconId)}`}
                      data-timeline-icon={action.timelineIconId}
                    >
                      <ActionIcon class="size-4" />
                    </div>
                    <div class="post-game-action__content">
                      <div class="post-game-action__meta">
                        <Badge variant="outline">{action.moveCategoryLabel}</Badge>
                        <span class={`post-game-inline-chip ${groupActorTextClasses(action.actorTone)}`}>
                          {getSideLabel(action.actorSide)}
                        </span>
                        <span class="post-game-action__clock">
                          <Clock3 class="size-3.5" />
                          {formatClock(action.timestamp)}
                        </span>
                      </div>

                      <p class="post-game-action__text">
                        {#each action.segments as segment, index (`${action.id}:${index}`)}
                          {#if segment.kind === "card"}
                            <CardLogToken cardId={segment.cardId} />
                          {:else if segment.kind === "player"}
                            <span class={`post-game-inline-chip ${groupActorTextClasses(segment.tone)}`}>
                              {segment.text}
                            </span>
                          {:else if segment.kind === "stat"}
                            <span class="post-game-action__stat">{segment.text}</span>
                          {:else if segment.kind === "icon"}
                            <span
                              class="post-game-action__stat"
                              aria-label={segment.label}
                              title={segment.label}
                            >
                              <Droplets class="size-3.5" />
                            </span>
                          {:else}
                            {segment.text}
                          {/if}
                        {/each}
                      </p>

                      {#if showTechnical}
                        <div class="post-game-action__technical">
                          <div class="post-game-action__technical-row">
                            <span>{m["sim.postGame.timeline.technical.moveId"]({})}</span>
                            <code>{action.moveId}</code>
                          </div>

                          {#if action.typedMessages.length > 0}
                            <div class="post-game-action__technical-list">
                              {#each action.typedMessages as message (`${action.id}:${message.key}`)}
                                <div class="post-game-action__technical-message">
                                  <code>{message.key}</code>
                                  <span>{message.text}</span>
                                </div>
                              {/each}
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </article>
                {/each}
              </div>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</section>

<style>
  .post-game-panel {
    display: grid;
    gap: 1rem;
    padding-top: 1rem;
  }

  .post-game-panel__header h3 {
    margin: 0;
    font-size: 1.02rem;
    font-weight: 800;
  }

  .post-game-panel__header p {
    margin: 0.2rem 0 0;
    color: rgba(148, 163, 184, 0.92);
  }

  .post-game-empty-card,
  .post-game-turn {
    border: 1px solid rgba(51, 65, 85, 0.85);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.94));
    border-radius: 1.1rem;
  }

  .post-game-empty-card {
    padding: 1rem;
    color: rgba(148, 163, 184, 0.92);
  }

  .post-game-timeline,
  .post-game-action-list {
    display: grid;
    gap: 0.65rem;
    margin-top: 0.9rem;
  }

  .post-game-turn {
    overflow: hidden;
  }

  .post-game-turn__header {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.85rem;
    align-items: center;
    padding: 0.95rem 1rem;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
  }

  .post-game-turn__summary-line,
  .post-game-turn__categories,
  .post-game-turn__meta,
  .post-game-action__meta,
  .post-game-turn__toolbar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .post-game-turn__summary h4 {
    margin: 0.4rem 0 0;
    font-size: 1rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .post-game-turn__summary p {
    margin: 0.25rem 0 0;
    color: rgba(148, 163, 184, 0.92);
  }

  .post-game-turn__meta {
    justify-content: flex-end;
  }

  .post-game-turn__chevron {
    color: rgba(148, 163, 184, 0.92);
    transition: transform 160ms ease;
  }

  .post-game-turn__chevron--expanded {
    transform: rotate(180deg);
  }

  .post-game-turn__body {
    border-top: 1px solid rgba(51, 65, 85, 0.55);
    padding: 0 1rem 1rem;
  }

  .post-game-turn__toolbar {
    justify-content: flex-end;
    margin-top: 0.75rem;
  }

  .post-game-turn__technical-toggle {
    border: 0;
    background: transparent;
    color: #bae6fd;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0;
  }

  .post-game-category-chip,
  .post-game-inline-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .post-game-inline-chip {
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .post-game-action {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0.95rem 0;
    border-bottom: 1px solid rgba(51, 65, 85, 0.3);
  }

  .post-game-action:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .post-game-action__icon {
    width: 2.2rem;
    height: 2.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.8rem;
    border: 1px solid transparent;
  }

  .post-game-action__content {
    min-width: 0;
  }

  .post-game-action__text {
    margin: 0.45rem 0 0;
    line-height: 1.55;
    color: rgba(226, 232, 240, 0.92);
  }

  .post-game-action__clock,
  .post-game-action__stat {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #e0f2fe;
    font-weight: 600;
  }

  .post-game-action__technical {
    margin-top: 0.7rem;
    padding: 0.8rem;
    border-radius: 0.95rem;
    background: rgba(2, 6, 23, 0.56);
    border: 1px solid rgba(51, 65, 85, 0.48);
  }

  .post-game-action__technical-row {
    display: grid;
    gap: 0.25rem;
  }

  .post-game-action__technical-row span {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.9);
  }

  .post-game-action__technical-row code,
  .post-game-action__technical-message code {
    font-size: 0.74rem;
    color: #bae6fd;
  }

  .post-game-action__technical-list {
    display: grid;
    gap: 0.45rem;
    margin-top: 0.65rem;
  }

  .post-game-action__technical-message {
    display: grid;
    gap: 0.22rem;
  }

  .post-game-action__technical-message span {
    color: rgba(226, 232, 240, 0.88);
    line-height: 1.45;
  }

  .post-game-actor--self {
    border-color: rgba(52, 211, 153, 0.45);
    background: rgba(16, 185, 129, 0.12);
    color: #d1fae5;
  }

  .post-game-actor--opponent {
    border-color: rgba(251, 113, 133, 0.45);
    background: rgba(244, 63, 94, 0.12);
    color: #ffe4e6;
  }

  .post-game-actor--player-one {
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(14, 165, 233, 0.12);
    color: #e0f2fe;
  }

  .post-game-actor--player-two {
    border-color: rgba(251, 191, 36, 0.45);
    background: rgba(245, 158, 11, 0.12);
    color: #fef3c7;
  }

  .post-game-actor--system {
    border-color: rgba(148, 163, 184, 0.35);
    background: rgba(100, 116, 139, 0.12);
    color: #e2e8f0;
  }

  .post-game-tone--play {
    border-color: rgba(59, 130, 246, 0.35);
    background: rgba(37, 99, 235, 0.14);
    color: #dbeafe;
  }

  .post-game-tone--ink {
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(5, 150, 105, 0.14);
    color: #d1fae5;
  }

  .post-game-tone--quest {
    border-color: rgba(245, 158, 11, 0.35);
    background: rgba(217, 119, 6, 0.14);
    color: #fef3c7;
  }

  .post-game-tone--challenge {
    border-color: rgba(248, 113, 113, 0.35);
    background: rgba(220, 38, 38, 0.14);
    color: #fee2e2;
  }

  .post-game-tone--ability {
    border-color: rgba(168, 85, 247, 0.35);
    background: rgba(147, 51, 234, 0.14);
    color: #f3e8ff;
  }

  .post-game-tone--move {
    border-color: rgba(34, 197, 94, 0.35);
    background: rgba(22, 163, 74, 0.14);
    color: #dcfce7;
  }

  .post-game-tone--pass {
    border-color: rgba(148, 163, 184, 0.35);
    background: rgba(100, 116, 139, 0.14);
    color: #e2e8f0;
  }

  .post-game-tone--concede {
    border-color: rgba(244, 63, 94, 0.35);
    background: rgba(225, 29, 72, 0.14);
    color: #ffe4e6;
  }

  .post-game-tone--system {
    border-color: rgba(148, 163, 184, 0.35);
    background: rgba(71, 85, 105, 0.14);
    color: #e2e8f0;
  }
</style>
