<script lang="ts">
  import {
    Bug,
    ChevronDown,
    Download,
    Flag,
    LoaderCircle,
    Lock,
    MessageSquarePlus,
    NotebookPen,
    Save,
    ScrollText,
    Trophy,
  } from "@lucide/svelte";
  import { m } from "$lib/i18n/messages.js";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Button } from "$lib/design-system/primitives/button";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import PostGameTimelineSection from "./PostGameTimelineSection.svelte";
  import {
    fetchPostGameRecord,
    savePostGameNote,
    type PostGameRecordEnvelope,
  } from "./notes-api.js";
  import {
    clearRequestedPostGameRecord,
    createInitialPostGameRecordRequestState,
    markPostGameRecordLoaded,
    markPostGameRecordRequested,
    resetPostGameRecordRequestStateForGame,
    shouldAutoLoadPostGameRecord,
  } from "./record-request-state.js";
  import { buildPostGameSummaryFromCanonical } from "./summary.js";
  import type {
    PostGameNoteState,
    PostGameSectionId,
    PostGameSummary,
  } from "./types.js";
  import { downloadReplayZip } from "@/features/replay/download-replay.js";
  import {
    isReplayStoreAvailable,
    saveReplayFromApi,
    isReplaySaved,
  } from "@/features/replay/replay-store.js";
  import { fetchReplayBlob, decompressReplayBlob } from "@/features/replay/fetch-replay.js";
  import type { MatchNavigationContext, LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
  import { useLorcanaGameContext } from "@/features/simulator/context/game-context.svelte.js";
  import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";

  interface PostGameSummaryDialogProps {
    open?: boolean;
    gameId: string;
    summary: PostGameSummary;
    onReturnToMatchmaking: () => void | Promise<void>;
    isAuthenticated?: boolean;
    loadRecord?: (gameId: string) => Promise<PostGameRecordEnvelope>;
    saveNote?: (params: { gameId: string; note: string }) => Promise<PostGameRecordEnvelope>;
    initialSection?: PostGameSectionId;
    defaultExpandedTurnNumbers?: number[];
    defaultTechnicalTurnNumbers?: number[];
    matchContext?: MatchNavigationContext | null;
    ownerSide?: LorcanaPlayerSide | null;
    onNextGame?: (() => void) | null;
    onOpenBugReport?: () => void;
    onOpenFeedback?: () => void;
    onOpenPlayerReport?: () => void;
  }

  let {
    open = $bindable(false),
    gameId,
    summary,
    onReturnToMatchmaking,
    isAuthenticated = false,
    loadRecord = fetchPostGameRecord,
    saveNote = savePostGameNote,
    initialSection = "overview",
    defaultExpandedTurnNumbers = [],
    defaultTechnicalTurnNumbers = [],
    matchContext = null,
    ownerSide = null,
    onNextGame = null,
    onOpenBugReport,
    onOpenFeedback,
    onOpenPlayerReport,
  }: PostGameSummaryDialogProps = $props();

  const gameContext = (() => {
    try {
      return useLorcanaGameContext();
    } catch {
      return null;
    }
  })();

  function resolvePlayerLabel(playerId: string | null | undefined): string | null {
    if (!playerId) return null;
    return gameContext?.resolvePlayerName(playerId) ?? null;
  }

  function resolvePlayerTier(playerId: string | null | undefined): string | undefined {
    if (!playerId) return undefined;
    return gameContext?.getPlayerSubscriptionTier(playerId) ?? undefined;
  }

  function sideToPlayerId(side: LorcanaPlayerSide | null | undefined): string | null {
    if (!side) return null;
    return gameContext?.getOwnerIdForSide(side) ?? null;
  }

  function sideToPlayerName(side: LorcanaPlayerSide | null | undefined): string | null {
    return resolvePlayerLabel(sideToPlayerId(side));
  }

  function sideToTierConfig(side: LorcanaPlayerSide | null | undefined) {
    return resolvePatronTierConfig(resolvePlayerTier(sideToPlayerId(side)));
  }

  // The server emits the raw playerId in conceded/timeout reasons (e.g.
  // "gpsJEhXlom8biZ68_D5vAR conceded"). Replace any UUID-like token with the
  // resolved display name so players don't see internal IDs.
  function humanizeReason(reason: string | null | undefined): string | null {
    if (!reason) return null;
    return reason.replace(/[A-Za-z0-9_-]{16,}/g, (token) => {
      const resolved = resolvePlayerLabel(token);
      return resolved ?? token;
    });
  }

  let activeSection = $state<PostGameSectionId>("overview");
  let recordRequestState = $state(createInitialPostGameRecordRequestState());
  let noteState = $state<PostGameNoteState>({
    value: "",
    lastSavedValue: "",
    isLoading: false,
    isSaving: false,
    loaded: false,
    error: null,
  });
  let record = $state<PostGameRecordEnvelope | null>(null);
  let leavingMatch = $state(false);
  let pendingCloseAction = $state<"close" | "return" | null>(null);
  let replayDownloading = $state(false);
  let replaySaving = $state(false);
  let replaySaved = $state(false);

  const canSaveReplay = isReplayStoreAvailable();
  const effectiveSummary = $derived.by(() =>
    record?.postGame ? buildPostGameSummaryFromCanonical(record.postGame, summary.outcome.viewerSide) : summary,
  );

  const sectionButtons = [
    {
      id: "overview",
      label: m["sim.postGame.section.overview"]({}),
      icon: Trophy,
    },
    {
      id: "timeline",
      label: m["sim.postGame.section.timeline"]({}),
      icon: ScrollText,
    },
    {
      id: "notes",
      label: m["sim.postGame.section.notes"]({}),
      icon: NotebookPen,
    },
  ] satisfies Array<{ id: PostGameSectionId; label: string; icon: typeof Trophy }>;

  const viewerResultLabel = $derived.by(() => {
    switch (effectiveSummary.outcome.viewerResult) {
      case "victory":
        return m["sim.postGame.result.victory"]({});
      case "defeat":
        return m["sim.postGame.result.defeat"]({});
      case "spectator":
        return m["sim.postGame.result.spectator"]({});
      default:
        return m["sim.postGame.result.complete"]({});
    }
  });

  const winnerLabel = $derived(getSideLabel(effectiveSummary.outcome.winnerSide));
  const loserLabel = $derived(getSideLabel(effectiveSummary.outcome.loserSide));
  const outcomeHighlight = $derived(
    effectiveSummary.highlights.find((highlight) => highlight.id === "highlight:outcome") ?? null,
  );
  const recordedSpanMs = $derived.by(() => {
    const firstTurn = effectiveSummary.turns[0];
    const lastTurn = effectiveSummary.turns.at(-1);

    if (!firstTurn || !lastTurn) {
      return 0;
    }

    return Math.max(0, lastTurn.endedAt - firstTurn.startedAt);
  });
  const noteDirty = $derived(
    noteState.loaded && noteState.value.trim() !== noteState.lastSavedValue.trim(),
  );
  const noteStatus = $derived.by(() => {
    if (noteState.isLoading) {
      return m["sim.postGame.notes.loading"]({});
    }
    if (noteState.isSaving) {
      return m["sim.postGame.notes.saving"]({});
    }
    if (noteState.error) {
      return noteState.error;
    }
    if (!noteState.loaded) {
      return m["sim.postGame.notes.idle"]({});
    }
    if (noteDirty) {
      return m["sim.postGame.notes.unsaved"]({});
    }
    return m["sim.postGame.notes.saved"]({});
  });

  $effect(() => {
    if (!open || !gameId || !canSaveReplay) {
      replaySaved = false;
      return;
    }

    const requestGameId = gameId;
    let cancelled = false;

    isReplaySaved(requestGameId)
      .then((saved) => {
        if (!cancelled && open && gameId === requestGameId) {
          replaySaved = saved;
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("[PostGame] Failed to check replay saved state:", error);
          replaySaved = false;
        }
      });

    return () => {
      cancelled = true;
    };
  });

  $effect(() => {
    if (!open) {
      return;
    }

    activeSection = initialSection;
  });

  $effect(() => {
    const nextGameId = gameId;
    const nextRequestState = resetPostGameRecordRequestStateForGame(recordRequestState, nextGameId);
    if (
      nextRequestState.requestedGameId === recordRequestState.requestedGameId &&
      nextRequestState.loadedGameId === recordRequestState.loadedGameId
    ) {
      return;
    }

    recordRequestState = nextRequestState;
    record = null;
    noteState = {
      value: "",
      lastSavedValue: "",
      isLoading: false,
      isSaving: false,
      loaded: false,
      error: null,
    };
  });

  $effect(() => {
    if (
      !shouldAutoLoadPostGameRecord({
        open,
        gameId,
        requestState: recordRequestState,
        isLoading: noteState.isLoading,
      })
    ) {
      return;
    }

    recordRequestState = markPostGameRecordRequested(recordRequestState, gameId);
    noteState = {
      ...noteState,
      isLoading: true,
      error: null,
    };

    void loadRecord(gameId)
      .then((nextRecord) => {
        recordRequestState = markPostGameRecordLoaded(recordRequestState, gameId);
        record = nextRecord;
        noteState = isAuthenticated
          ? {
              value: nextRecord.note,
              lastSavedValue: nextRecord.note,
              isLoading: false,
              isSaving: false,
              loaded: true,
              error: null,
            }
          : {
              ...noteState,
              isLoading: false,
            };
      })
      .catch((error: unknown) => {
        noteState = isAuthenticated
          ? {
              ...noteState,
              isLoading: false,
              loaded: true,
              error:
                error instanceof Error
                  ? error.message
                  : m["sim.postGame.notes.loadError"]({}),
            }
          : {
              ...noteState,
              isLoading: false,
            };
      });
  });

  $effect(() => {
    if (open) {
      return;
    }

    const nextRequestState = clearRequestedPostGameRecord(recordRequestState);
    if (
      nextRequestState.requestedGameId === recordRequestState.requestedGameId &&
      nextRequestState.loadedGameId === recordRequestState.loadedGameId
    ) {
      return;
    }

    recordRequestState = nextRequestState;
  });

  async function handleDownloadReplay(): Promise<void> {
    if (replayDownloading) return;
    replayDownloading = true;

    try {
      await downloadReplayZip(gameId, record?.postGame?.analytics ?? undefined);
    } catch (error) {
      console.error("[PostGame] Failed to download replay:", error);
    } finally {
      replayDownloading = false;
    }
  }

  async function handleSaveReplay(): Promise<void> {
    if (replaySaving || replaySaved) return;
    replaySaving = true;

    try {
      await saveReplayFromApi(gameId, fetchReplayBlob, async (compressed) => {
        const data = await decompressReplayBlob(compressed);
        return data;
      });
      replaySaved = true;
    } catch (error) {
      console.error("[PostGame] Failed to save replay:", error);
    } finally {
      replaySaving = false;
    }
  }

  async function handleSaveNotes(): Promise<void> {
    if (noteState.isSaving || noteState.isLoading) {
      return;
    }

    noteState = {
      ...noteState,
      isSaving: true,
      error: null,
    };

    try {
      const nextRecord = await saveNote({ gameId, note: noteState.value });
      record = nextRecord;
      noteState = {
        value: nextRecord.note,
        lastSavedValue: nextRecord.note,
        isLoading: false,
        isSaving: false,
        loaded: true,
        error: null,
      };
    } catch (error) {
      noteState = {
        ...noteState,
        isSaving: false,
        error:
          error instanceof Error
            ? error.message
            : m["sim.postGame.notes.saveError"]({}),
      };
    }
  }

  async function handleReturn(): Promise<void> {
    if (leavingMatch) {
      return;
    }

    if (noteDirty) {
      pendingCloseAction = "return";
      return;
    }

    leavingMatch = true;
    try {
      await onReturnToMatchmaking();
    } finally {
      leavingMatch = false;
    }
  }

  function handleClose(): void {
    if (noteDirty) {
      pendingCloseAction = "close";
      return;
    }
    open = false;
  }

  async function handleConfirmLeave(): Promise<void> {
    const action = pendingCloseAction;
    pendingCloseAction = null;
    if (action === "close") {
      open = false;
    } else if (action === "return") {
      leavingMatch = true;
      try {
        await onReturnToMatchmaking();
      } finally {
        leavingMatch = false;
      }
    }
  }

  async function handleSaveAndContinue(): Promise<void> {
    await handleSaveNotes();
    if (!noteState.error) {
      await handleConfirmLeave();
    }
  }

  function handleCancelLeave(): void {
    pendingCloseAction = null;
    activeSection = "notes";
  }

  function getSideLabel(side: typeof summary.outcome.winnerSide): string {
    if (!side) {
      return m["sim.postGame.result.unknownPlayer"]({});
    }

    if (effectiveSummary.outcome.viewerSide && side === effectiveSummary.outcome.viewerSide) {
      return m["sim.player.you"]({});
    }

    if (effectiveSummary.outcome.viewerSide && side !== effectiveSummary.outcome.viewerSide) {
      return m["sim.player.opponent"]({});
    }

    return side === "playerOne"
      ? m["sim.player.side.playerOne"]({})
      : m["sim.player.side.playerTwo"]({});
  }

  function formatDuration(durationMs: number): string {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function actorToneFromSide(side: typeof summary.outcome.winnerSide) {
    if (!side) {
      return "system" as const;
    }

    if (effectiveSummary.outcome.viewerSide && side === effectiveSummary.outcome.viewerSide) {
      return "self" as const;
    }

    if (effectiveSummary.outcome.viewerSide && side !== effectiveSummary.outcome.viewerSide) {
      return "opponent" as const;
    }

    return side;
  }

  function groupActorTextClasses(tone: ReturnType<typeof actorToneFromSide>): string {
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

</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="post-game-overlay" />
    <Dialog.Content class="post-game-dialog" showCloseButton={false}>
      <Dialog.Title class="sr-only">{m["sim.postGame.title"]({})}</Dialog.Title>
      <Dialog.Description class="sr-only">
        {m["sim.postGame.description"]({})}
      </Dialog.Description>

      <header class="post-game-header">
        <div class="post-game-header__eyebrow">
          <Badge variant="outline" class="post-game-result-badge">{viewerResultLabel}</Badge>
          <span class="post-game-header__turn">
            {m["sim.postGame.turn"]({ turn: effectiveSummary.outcome.finalTurnNumber })}
          </span>
          <span class="post-game-header__turn">
            {m["sim.postGame.overview.loggedActions"]({ count: effectiveSummary.totalLogEntries })}
          </span>
        </div>
        <h2 class="post-game-header__title">
          {outcomeHighlight?.title ?? m["sim.postGame.title"]({})}
        </h2>
        <p class="post-game-header__summary">
          {#if effectiveSummary.outcome.winnerSide && effectiveSummary.outcome.loserSide}
            {winnerLabel}
            {m["sim.postGame.summary.defeated"]({ loser: loserLabel })}
          {:else}
            {m["sim.postGame.summary.completed"]({})}
          {/if}
        </p>
        <p class="post-game-header__reason">
          {humanizeReason(effectiveSummary.outcome.reason) ?? outcomeHighlight?.detail ?? m["sim.postGame.reason.none"]({})}
        </p>

        <div class="post-game-facts">
          <div class="post-game-fact">
            <span>{m["sim.postGame.metric.turns"]({})}</span>
            <strong>{effectiveSummary.outcome.finalTurnNumber}</strong>
          </div>
          <div class="post-game-fact">
            <span>{m["sim.postGame.timeline.duration.label"]({})}</span>
            <strong>{formatDuration(recordedSpanMs)}</strong>
          </div>
          <div class="post-game-fact">
            <span>{m["sim.postGame.timeline.actionsLabel"]({})}</span>
            <strong>{effectiveSummary.totalLogEntries}</strong>
          </div>
        </div>
      </header>

      <nav class="post-game-sections" aria-label={m["sim.postGame.section.aria"]({})}>
        {#each sectionButtons as section (section.id)}
          {@const Icon = section.icon}
          <button
            type="button"
            class="post-game-sections__button"
            class:post-game-sections__button--active={activeSection === section.id}
            onclick={() => (activeSection = section.id)}
          >
            <Icon class="size-4" />
            <span>{section.label}</span>
          </button>
        {/each}
      </nav>

      <div class="post-game-body">
        {#if activeSection === "overview"}
          <section class="post-game-panel">
            <div class="post-game-scoreboard">
              {#each [effectiveSummary.players.playerOne, effectiveSummary.players.playerTwo] as player (player.side)}
                {@const playerName = sideToPlayerName(player.side)}
                {@const tierConfig = sideToTierConfig(player.side)}
                <article class="post-game-scorecard">
                  <div class="post-game-scorecard__header">
                    <div class="min-w-0">
                      <p class="post-game-scorecard__label">{getSideLabel(player.side)}</p>
                      {#if playerName}
                        <p class="post-game-scorecard__name">
                          {#if tierConfig}
                            <span
                              class="post-game-scorecard__tier-dot"
                              style:--patron-color={tierConfig.color}
                              style:--patron-glow={tierConfig.glow}
                              style:--patron-border={tierConfig.borderColor}
                              title={tierConfig.name()}
                              aria-label={tierConfig.name()}
                            ></span>
                          {/if}
                          <span style:color={tierConfig?.color ?? undefined}>{playerName}</span>
                        </p>
                      {/if}
                      <h3 class="post-game-scorecard__lore">
                        {player.lore}
                        <span>{m["sim.lore.label"]({})}</span>
                      </h3>
                    </div>
                    {#if effectiveSummary.outcome.winnerSide === player.side}
                      <Badge class="post-game-scorecard__winner">
                        {m["sim.postGame.winner"]({})}
                      </Badge>
                    {/if}
                  </div>

                  <dl class="post-game-metrics">
                    <div><dt>{m["sim.postGame.metric.deck"]({})}</dt><dd>{player.deckCount}</dd></div>
                    <div><dt>{m["sim.postGame.metric.hand"]({})}</dt><dd>{player.handCount}</dd></div>
                    <div><dt>{m["sim.postGame.metric.discard"]({})}</dt><dd>{player.discardCount}</dd></div>
                    <div><dt>{m["sim.postGame.metric.ink"]({})}</dt><dd>{player.availableInk ?? "?"}/{player.inkwellCount}</dd></div>
                    <div><dt>{m["sim.postGame.metric.board"]({})}</dt><dd>{player.boardCount}</dd></div>
                    <div><dt>{m["sim.postGame.metric.ready"]({})}</dt><dd>{player.readyCount}/{player.exertedCount}</dd></div>
                  </dl>

                  <dl class="post-game-counters">
                    <div><dt>{m["sim.postGame.counter.played"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].cardsPlayed}</dd></div>
                    <div><dt>{m["sim.postGame.counter.inked"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].inked}</dd></div>
                    <div><dt>{m["sim.postGame.counter.quests"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].quests}</dd></div>
                    <div><dt>{m["sim.postGame.counter.challenges"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].challengeInitiations}</dd></div>
                    <div><dt>{m["sim.postGame.counter.moves"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].movesToLocations}</dd></div>
                    <div><dt>{m["sim.postGame.counter.abilities"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].abilityActivations}</dd></div>
                    <div><dt>{m["sim.postGame.counter.effects"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].effectResolutions}</dd></div>
                    <div><dt>{m["sim.postGame.counter.passes"]({})}</dt><dd>{effectiveSummary.countersBySide[player.side].passes}</dd></div>
                  </dl>
                </article>
              {/each}
            </div>

            <div class="post-game-overview-grid">
              <section class="post-game-card post-game-card--wide">
                <header>
                  <h3>{m["sim.postGame.highlights.title"]({})}</h3>
                  <p>{m["sim.postGame.highlights.description"]({})}</p>
                </header>
                <div class="post-game-highlight-list">
                  {#if effectiveSummary.highlights.length === 0}
                    <p class="post-game-empty-state">{m["sim.postGame.empty.highlights"]({})}</p>
                  {:else}
                    {#each effectiveSummary.highlights as highlight (highlight.id)}
                      <article class="post-game-highlight" class:post-game-highlight--emphasis={highlight.emphasis}>
                        <div class="post-game-highlight__meta">
                          {#if highlight.turnNumber}
                            <Badge variant="outline">
                              {m["sim.postGame.turnShort"]({ turn: highlight.turnNumber })}
                            </Badge>
                          {/if}
                          {#if highlight.actorSide}
                            <span class={`post-game-inline-chip ${groupActorTextClasses(actorToneFromSide(highlight.actorSide))}`}>
                              {getSideLabel(highlight.actorSide)}
                            </span>
                          {/if}
                        </div>
                        <h4>{highlight.title}</h4>
                        <p>{highlight.detail}</p>
                      </article>
                    {/each}
                  {/if}
                </div>
              </section>

              <section class="post-game-card">
                <header>
                  <h3>{m["sim.postGame.spotlights.lore"]({})}</h3>
                  <p>{m["sim.postGame.spotlights.loreDescription"]({})}</p>
                </header>
                <div class="post-game-spotlight-list">
                  {#if effectiveSummary.topLoreContributors.length === 0}
                    <p class="post-game-empty-state">{m["sim.postGame.empty.lore"]({})}</p>
                  {:else}
                    {#each effectiveSummary.topLoreContributors as spotlight (spotlight.id)}
                      <article class="post-game-spotlight">
                        <div>
                          <h4>{spotlight.label}</h4>
                          <p>{getSideLabel(spotlight.ownerSide)}</p>
                        </div>
                        <strong>{spotlight.value}</strong>
                      </article>
                    {/each}
                  {/if}
                </div>
              </section>

              <section class="post-game-card">
                <header>
                  <h3>{m["sim.postGame.spotlights.played"]({})}</h3>
                  <p>{m["sim.postGame.spotlights.playedDescription"]({})}</p>
                </header>
                <div class="post-game-spotlight-list">
                  {#each effectiveSummary.mostPlayedCards as spotlight (spotlight.id)}
                    <article class="post-game-spotlight">
                      <div>
                        <h4>{spotlight.label}</h4>
                        <p>{getSideLabel(spotlight.ownerSide)}</p>
                      </div>
                      <strong>{spotlight.value}</strong>
                    </article>
                  {/each}
                </div>
              </section>

              <section class="post-game-card">
                <header>
                  <h3>{m["sim.postGame.spotlights.challenges"]({})}</h3>
                  <p>{m["sim.postGame.spotlights.challengesDescription"]({})}</p>
                </header>
                <div class="post-game-spotlight-list">
                  {#if effectiveSummary.mostInvolvedChallengeCards.length === 0}
                    <p class="post-game-empty-state">{m["sim.postGame.empty.challenges"]({})}</p>
                  {:else}
                    {#each effectiveSummary.mostInvolvedChallengeCards as spotlight (spotlight.id)}
                      <article class="post-game-spotlight">
                        <div>
                          <h4>{spotlight.label}</h4>
                          <p>{getSideLabel(spotlight.ownerSide)}</p>
                        </div>
                        <strong>{spotlight.value}</strong>
                      </article>
                    {/each}
                  {/if}
                </div>
              </section>

              <section class="post-game-card">
                <header>
                  <h3>{m["sim.postGame.spotlights.abilities"]({})}</h3>
                  <p>{m["sim.postGame.spotlights.abilitiesDescription"]({})}</p>
                </header>
                <div class="post-game-spotlight-list">
                  {#if effectiveSummary.mostTriggeredAbilities.length === 0}
                    <p class="post-game-empty-state">{m["sim.postGame.empty.abilities"]({})}</p>
                  {:else}
                    {#each effectiveSummary.mostTriggeredAbilities as spotlight (spotlight.id)}
                      <article class="post-game-spotlight">
                        <div>
                          <h4>{spotlight.label}</h4>
                          <p>{spotlight.cardLabel ?? getSideLabel(spotlight.ownerSide)}</p>
                        </div>
                        <strong>{spotlight.count}</strong>
                      </article>
                    {/each}
                  {/if}
                </div>
              </section>
            </div>
          </section>
        {:else if activeSection === "timeline"}
          <PostGameTimelineSection
            turns={effectiveSummary.turns}
            totalLogEntries={effectiveSummary.totalLogEntries}
            viewerSide={effectiveSummary.outcome.viewerSide}
            initialExpandedTurnNumbers={defaultExpandedTurnNumbers}
            defaultTechnicalTurnNumbers={defaultTechnicalTurnNumbers}
          />
        {:else}
          <section class="post-game-panel">
            <header class="post-game-panel__header">
              <div>
                <h3>{m["sim.postGame.notes.title"]({})}</h3>
                <p>{m["sim.postGame.notes.description"]({})}</p>
              </div>
              {#if isAuthenticated}
                <div class="post-game-notes__header-actions">
                  {#if noteState.isLoading || noteState.isSaving}
                    <LoaderCircle class="size-4 animate-spin text-slate-300" />
                  {/if}
                  <Button
                    size="sm"
                    onclick={handleSaveNotes}
                    disabled={noteState.isSaving || noteState.isLoading || !noteDirty}
                  >
                    {m["sim.postGame.notes.save"]({})}
                  </Button>
                </div>
              {:else if noteState.isLoading || noteState.isSaving}
                <LoaderCircle class="size-4 animate-spin text-slate-300" />
              {/if}
            </header>

            {#if !isAuthenticated}
              <div class="post-game-notes-locked">
                <Lock class="size-5 text-slate-400" />
                <h4>{m["sim.postGame.notes.authRequired"]({})}</h4>
                <p>{m["sim.postGame.notes.authRequiredDetail"]({})}</p>
              </div>
              <div class="post-game-notes__actions">
                <Button
                  variant="outline"
                  onclick={() => {
                    activeSection = "overview";
                  }}
                >
                  {m["sim.postGame.notes.backToOverview"]({})}
                </Button>
              </div>
            {:else}
              <label class="post-game-notes__label" for="post-game-notes">
                {m["sim.postGame.notes.fieldLabel"]({})}
                {#if noteDirty}
                  <span class="post-game-notes__unsaved-dot"></span>
                {/if}
              </label>
              <textarea
                id="post-game-notes"
                class="post-game-notes__textarea"
                bind:value={noteState.value}
                rows="10"
                placeholder={m["sim.postGame.notes.placeholder"]({})}
              ></textarea>
              <p class="post-game-notes__status" class:post-game-notes__status--error={Boolean(noteState.error)}>
                {noteStatus}
              </p>
              <div class="post-game-notes__actions">
                <Button
                  variant="outline"
                  onclick={() => {
                    activeSection = "overview";
                  }}
                >
                  {m["sim.postGame.notes.backToOverview"]({})}
                </Button>
              </div>
            {/if}
          </section>
        {/if}
      </div>

      <Dialog.Footer class="post-game-footer">
        {#if pendingCloseAction}
          <div class="post-game-unsaved-confirm">
            <div class="post-game-unsaved-confirm__text">
              <strong>{m["sim.postGame.notes.unsavedConfirmTitle"]({})}</strong>
              <span>{m["sim.postGame.notes.unsavedConfirmDetail"]({})}</span>
            </div>
            <div class="post-game-unsaved-confirm__actions">
              <Button variant="outline" onclick={handleCancelLeave}>
                {m["sim.postGame.notes.unsavedConfirmCancel"]({})}
              </Button>
              <Button variant="outline" onclick={handleConfirmLeave}>
                {m["sim.postGame.notes.unsavedConfirmDiscard"]({})}
              </Button>
              <Button onclick={handleSaveAndContinue} disabled={noteState.isSaving}>
                {m["sim.postGame.notes.unsavedConfirmSave"]({})}
              </Button>
            </div>
          </div>
        {:else}
          <div class="post-game-footer__secondary">
            {#if onOpenBugReport || onOpenFeedback || onOpenPlayerReport}
              <div class="post-game-feedback-prompt">
                <span class="post-game-feedback-prompt__label">{m["sim.postGame.feedbackPrompt.label"]({})}</span>
                <div class="post-game-feedback-prompt__actions">
                  {#if onOpenBugReport}
                    <button
                      type="button"
                      class="post-game-feedback-btn post-game-feedback-btn--bug"
                      onclick={onOpenBugReport}
                    >
                      <Bug class="size-3.5 shrink-0" />
                      {m["sim.support.reportBugLabel"]({})}
                    </button>
                  {/if}
                  {#if onOpenFeedback}
                    <button
                      type="button"
                      class="post-game-feedback-btn post-game-feedback-btn--feedback"
                      onclick={onOpenFeedback}
                    >
                      <MessageSquarePlus class="size-3.5 shrink-0" />
                      {m["sim.support.shareFeedbackLabel"]({})}
                    </button>
                  {/if}
                  {#if onOpenPlayerReport}
                    <button
                      type="button"
                      class="post-game-feedback-btn post-game-feedback-btn--report"
                      onclick={onOpenPlayerReport}
                    >
                      <Flag class="size-3.5 shrink-0" />
                      {m["sim.player.report.openAria"]({})}
                    </button>
                  {/if}
                </div>
              </div>
            {/if}
            {#if matchContext && matchContext.format !== "best_of_1"}
              <div class="post-game-series-info">
                {#if matchContext.nextGameId}
                  <span>Game {matchContext.gameIndex} of 3</span>
                  <span class="post-game-series-info__sep">·</span>
                  {#if ownerSide === "playerTwo"}
                    <span>{matchContext.player2Score} – {matchContext.player1Score}</span>
                  {:else}
                    <span>{matchContext.player1Score} – {matchContext.player2Score}</span>
                  {/if}
                {:else}
                  <span>Match complete</span>
                  <span class="post-game-series-info__sep">·</span>
                  {#if ownerSide === "playerTwo"}
                    <span>{matchContext.player2Score} – {matchContext.player1Score}</span>
                  {:else}
                    <span>{matchContext.player1Score} – {matchContext.player2Score}</span>
                  {/if}
                {/if}
              </div>
            {/if}
            <div class="post-game-footer__replay-actions">
              <Button variant="outline" size="sm" onclick={handleDownloadReplay} disabled={replayDownloading}>
                <Download class="mr-1.5 size-3.5" />
                {replayDownloading
                  ? m["sim.postGame.replay.downloading"]({})
                  : m["sim.postGame.replay.download"]({})}
              </Button>
              {#if canSaveReplay}
                <Button variant="outline" size="sm" onclick={handleSaveReplay} disabled={replaySaving || replaySaved}>
                  <Save class="mr-1.5 size-3.5" />
                  {#if replaySaved}
                    {m["sim.postGame.replay.saved"]({})}
                  {:else if replaySaving}
                    {m["sim.postGame.replay.saving"]({})}
                  {:else}
                    {m["sim.postGame.replay.save"]({})}
                  {/if}
                </Button>
              {/if}
            </div>
          </div>

          <div class="post-game-footer__primary">
            <Button
              variant="outline"
              class="post-game-footer__close"
              onclick={handleClose}
            >
              {m["sim.postGame.close"]({})}
            </Button>
            {#if matchContext?.nextGameId && onNextGame}
              <Button
                class="post-game-footer__cta"
                onclick={() => onNextGame!()}
                disabled={leavingMatch || matchContext.navigating}
              >
                {#if matchContext.navigating}
                  <LoaderCircle class="mr-1.5 size-3.5 animate-spin" />
                  Loading…
                {:else}
                  Go to Next Game →
                {/if}
              </Button>
            {:else if !matchContext || matchContext.matchCompleted || matchContext.format === "best_of_1"}
              <Button
                class="post-game-footer__cta"
                onclick={handleReturn}
                disabled={leavingMatch}
              >
                {m["sim.postGame.returnToMatchmaking"]({})}
              </Button>
            {:else}
              <!--
                Game finished locally (board flipped to "finished") but the server
                has not yet confirmed match progression — neither nextGameId nor
                matchCompleted is set. Show a disabled "Finalizing…" placeholder
                so the user can't misclick "Back to matchmaking" during the
                persistence window (~1–3s).
              -->
              <Button class="post-game-footer__cta" disabled>
                <LoaderCircle class="mr-1.5 size-3.5 animate-spin" />
                Finalizing match…
              </Button>
            {/if}
          </div>
        {/if}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.post-game-overlay) {
    background:
      radial-gradient(circle at top, rgba(14, 116, 144, 0.18), transparent 48%),
      rgba(2, 6, 23, 0.82);
    backdrop-filter: blur(10px);
  }

  :global(.post-game-dialog) {
    width: min(94vw, 74rem);
    max-width: 74rem;
    height: min(92vh, 58rem);
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border-color: rgba(125, 211, 252, 0.28);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98)),
      rgba(2, 6, 23, 0.96);
    color: #e2e8f0;
    box-shadow: 0 32px 100px rgba(2, 6, 23, 0.6);
  }

  .post-game-empty-state {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .post-game-header {
    padding: 1rem 1rem 1.05rem;
    background:
      radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 42%),
      linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.74));
    border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  }

  .post-game-header__eyebrow {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  :global(.post-game-result-badge) {
    border-color: rgba(125, 211, 252, 0.32);
    background: rgba(8, 47, 73, 0.78);
    color: #e0f2fe;
  }

  .post-game-header__turn {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(191, 219, 254, 0.75);
  }

  .post-game-header__title {
    margin: 0.55rem 0 0;
    font-size: clamp(1.4rem, 2.8vw, 2.2rem);
    font-weight: 800;
    color: #f8fafc;
  }

  .post-game-header__summary {
    margin: 0.3rem 0 0;
    font-size: 1rem;
    color: rgba(226, 232, 240, 0.92);
  }

  .post-game-header__reason {
    margin: 0.35rem 0 0;
    color: rgba(148, 163, 184, 0.95);
    line-height: 1.5;
  }

  .post-game-facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    margin-top: 0.95rem;
  }

  .post-game-fact {
    padding: 0.75rem 0.85rem;
    border-radius: 1rem;
    border: 1px solid rgba(51, 65, 85, 0.62);
    background: rgba(2, 6, 23, 0.36);
  }

  .post-game-fact span {
    display: block;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.88);
  }

  .post-game-fact strong {
    display: block;
    margin-top: 0.18rem;
    font-size: 1.05rem;
    color: #f8fafc;
  }

  .post-game-sections {
    position: sticky;
    top: 0;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    padding: 0.85rem 1rem;
    background: rgba(2, 6, 23, 0.94);
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  }

  .post-game-sections__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    min-height: 2.65rem;
    border-radius: 999px;
    border: 1px solid rgba(51, 65, 85, 0.85);
    background: rgba(15, 23, 42, 0.96);
    color: rgba(226, 232, 240, 0.8);
    font-size: 0.82rem;
    font-weight: 700;
    transition: 160ms ease;
  }

  .post-game-sections__button--active {
    border-color: rgba(125, 211, 252, 0.52);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.9), rgba(8, 47, 73, 0.9));
    color: #f8fafc;
  }

  .post-game-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0 1rem 1rem;
  }

  .post-game-panel {
    display: grid;
    gap: 1rem;
    padding-top: 1rem;
  }

  .post-game-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
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

  .post-game-scoreboard {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .post-game-scorecard,
  .post-game-card,
  .post-game-turn,
  .post-game-empty-card {
    border: 1px solid rgba(51, 65, 85, 0.85);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.94));
    border-radius: 1.1rem;
  }

  .post-game-scorecard {
    padding: 1rem;
  }

  .post-game-scorecard__header {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .post-game-scorecard__label {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(125, 211, 252, 0.82);
  }

  .post-game-scorecard__name {
    margin: 0.2rem 0 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.92rem;
    font-weight: 700;
    color: #f8fafc;
    line-height: 1.15;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-game-scorecard__tier-dot {
    display: inline-block;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--patron-color);
    border: 1px solid var(--patron-border);
    box-shadow: 0 0 6px var(--patron-glow);
    flex-shrink: 0;
  }

  .post-game-scorecard__lore {
    margin: 0.2rem 0 0;
    display: flex;
    gap: 0.45rem;
    align-items: baseline;
    font-size: 1.8rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .post-game-scorecard__lore span {
    font-size: 0.86rem;
    color: rgba(191, 219, 254, 0.72);
  }

  :global(.post-game-scorecard__winner) {
    background: rgba(20, 83, 45, 0.85);
    color: #dcfce7;
  }

  .post-game-metrics,
  .post-game-counters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    margin: 0.9rem 0 0;
  }

  .post-game-metrics div,
  .post-game-counters div {
    padding: 0.7rem 0.75rem;
    border-radius: 0.95rem;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(51, 65, 85, 0.52);
  }

  .post-game-metrics dt,
  .post-game-counters dt {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.88);
  }

  .post-game-metrics dd,
  .post-game-counters dd {
    margin: 0.2rem 0 0;
    font-size: 1rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .post-game-overview-grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .post-game-card {
    padding: 1rem;
  }

  .post-game-card--wide {
    grid-column: 1 / -1;
  }

  .post-game-card header h3 {
    margin: 0;
    font-size: 0.96rem;
    font-weight: 800;
  }

  .post-game-card header p {
    margin: 0.2rem 0 0;
    font-size: 0.84rem;
    color: rgba(148, 163, 184, 0.92);
  }

  .post-game-highlight-list,
  .post-game-spotlight-list {
    display: grid;
    gap: 0.65rem;
    margin-top: 0.9rem;
  }

  .post-game-highlight {
    padding: 0.9rem;
    border-radius: 1rem;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(51, 65, 85, 0.42);
  }

  .post-game-highlight--emphasis {
    border-color: rgba(125, 211, 252, 0.45);
    background: linear-gradient(180deg, rgba(14, 116, 144, 0.18), rgba(15, 23, 42, 0.76));
  }

  .post-game-highlight h4 {
    margin: 0.35rem 0 0;
    font-size: 0.94rem;
    font-weight: 700;
  }

  .post-game-highlight p,
  .post-game-spotlight p {
    margin: 0.28rem 0 0;
    line-height: 1.5;
    color: rgba(226, 232, 240, 0.88);
  }

  .post-game-highlight__meta {
    display: flex;
    gap: 0.45rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .post-game-spotlight {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: center;
    padding: 0.85rem;
    border-radius: 1rem;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(51, 65, 85, 0.42);
  }

  .post-game-spotlight h4 {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 700;
  }

  .post-game-spotlight strong {
    font-size: 1.25rem;
    color: #f8fafc;
  }

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

  .post-game-notes-locked {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
    padding: 2.5rem 1.5rem;
    border-radius: 1.1rem;
    border: 1px dashed rgba(71, 85, 105, 0.7);
    background: rgba(15, 23, 42, 0.52);
    text-align: center;
  }

  .post-game-notes-locked h4 {
    margin: 0;
    font-size: 0.96rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .post-game-notes-locked p {
    margin: 0;
    max-width: 28rem;
    font-size: 0.86rem;
    line-height: 1.55;
    color: rgba(148, 163, 184, 0.92);
  }

  .post-game-notes__header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .post-game-notes__label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.84rem;
    font-weight: 700;
    color: rgba(226, 232, 240, 0.92);
  }

  .post-game-notes__unsaved-dot {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: #38bdf8;
    flex-shrink: 0;
  }

  .post-game-notes__textarea {
    width: 100%;
    resize: vertical;
    min-height: 13rem;
    border-radius: 1rem;
    border: 1px solid rgba(71, 85, 105, 0.9);
    background: rgba(2, 6, 23, 0.72);
    padding: 0.95rem 1rem;
    color: #f8fafc;
    line-height: 1.55;
    outline: none;
  }

  .post-game-notes__textarea:focus {
    border-color: rgba(56, 189, 248, 0.75);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.14);
  }

  .post-game-notes__status {
    margin: 0;
    min-height: 1.25rem;
    font-size: 0.82rem;
    color: rgba(148, 163, 184, 0.95);
  }

  .post-game-notes__status--error {
    color: #fca5a5;
  }

  .post-game-notes__actions {
    display: flex;
    gap: 0.65rem;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: end;
  }

  :global(.post-game-footer) {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(2, 6, 23, 0.96);
    flex-shrink: 0;
  }

  .post-game-footer__secondary {
    display: flex;
    gap: 0.65rem;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .post-game-footer__replay-actions {
    display: flex;
    gap: 0.45rem;
    flex-wrap: wrap;
    margin-left: auto;
  }

  .post-game-footer__primary {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.55rem;
    align-items: stretch;
  }

  :global(.post-game-footer__cta) {
    min-height: 2.75rem;
    font-weight: 800;
    font-size: 0.95rem;
  }

  :global(.post-game-footer__close) {
    min-height: 2.75rem;
  }

  .post-game-unsaved-confirm {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    flex-wrap: wrap;
  }

  .post-game-unsaved-confirm__text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    min-width: 0;
  }

  .post-game-unsaved-confirm__text strong {
    font-size: 0.85rem;
    color: rgba(248, 250, 252, 0.95);
  }

  .post-game-unsaved-confirm__text span {
    font-size: 0.78rem;
    color: rgba(148, 163, 184, 0.8);
  }

  .post-game-unsaved-confirm__actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .post-game-feedback-prompt {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin-right: auto;
    min-width: 0;
  }

  .post-game-feedback-prompt__label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.75);
  }

  .post-game-feedback-prompt__actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .post-game-feedback-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.42rem 0.85rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    border: 1px solid;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      transform 150ms ease,
      box-shadow 150ms ease;
    white-space: nowrap;
  }

  .post-game-feedback-btn:hover,
  .post-game-feedback-btn:focus-visible {
    outline: none;
    transform: translateY(-1px);
  }

  .post-game-feedback-btn--bug {
    background: rgba(120, 53, 15, 0.45);
    border-color: rgba(251, 146, 60, 0.5);
    color: #fed7aa;
    box-shadow: 0 0 0 0 rgba(251, 146, 60, 0);
  }

  .post-game-feedback-btn--bug:hover,
  .post-game-feedback-btn--bug:focus-visible {
    background: rgba(120, 53, 15, 0.7);
    border-color: rgba(251, 146, 60, 0.8);
    box-shadow: 0 0 8px rgba(251, 146, 60, 0.2);
  }

  .post-game-feedback-btn--feedback {
    background: rgba(12, 74, 110, 0.45);
    border-color: rgba(56, 189, 248, 0.45);
    color: #bae6fd;
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }

  .post-game-feedback-btn--feedback:hover,
  .post-game-feedback-btn--feedback:focus-visible {
    background: rgba(12, 74, 110, 0.7);
    border-color: rgba(56, 189, 248, 0.8);
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
  }

  .post-game-series-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: auto;
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.9);
    letter-spacing: 0.02em;
  }

  .post-game-series-info__sep {
    color: rgba(100, 116, 139, 0.6);
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

  @media (max-width: 900px) {
    :global(.post-game-dialog) {
      width: min(96vw, 46rem);
      height: min(95vh, 60rem);
    }

    .post-game-scoreboard,
    .post-game-overview-grid,
    .post-game-metrics,
    .post-game-counters,
    .post-game-facts {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    :global(.post-game-dialog) {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      border-radius: 0;
    }

    .post-game-header {
      padding-top: calc(0.75rem + env(safe-area-inset-top));
      padding-bottom: 0.7rem;
    }

    .post-game-header__eyebrow {
      gap: 0.4rem;
    }

    .post-game-header__title {
      margin-top: 0.4rem;
      font-size: clamp(1.1rem, 5.6vw, 1.45rem);
      line-height: 1.12;
    }

    .post-game-header__summary {
      margin-top: 0.2rem;
      font-size: 0.88rem;
    }

    .post-game-header__reason {
      margin-top: 0.2rem;
      font-size: 0.8rem;
      line-height: 1.35;
    }

    .post-game-facts {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.45rem;
      margin-top: 0.65rem;
    }

    .post-game-fact {
      padding: 0.5rem 0.45rem;
      border-radius: 0.75rem;
    }

    .post-game-fact span {
      font-size: 0.58rem;
    }

    .post-game-fact strong {
      font-size: 0.88rem;
    }

    .post-game-header,
    .post-game-sections,
    .post-game-body,
    :global(.post-game-footer) {
      padding-left: 0.85rem;
      padding-right: 0.85rem;
    }

    .post-game-sections {
      gap: 0.45rem;
      padding-top: 0.65rem;
      padding-bottom: 0.65rem;
    }

    .post-game-sections__button {
      min-height: 2.2rem;
      font-size: 0.7rem;
      gap: 0.3rem;
    }

    .post-game-body {
      padding-bottom: 0.7rem;
    }

    .post-game-panel {
      padding-top: 0.75rem;
    }

    .post-game-notes__actions {
      justify-content: stretch;
    }

    :global(.post-game-footer) {
      gap: 0.4rem;
      padding-top: 0.5rem;
      padding-bottom: calc(0.55rem + env(safe-area-inset-bottom));
    }

    .post-game-footer__secondary {
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0.4rem;
      overflow-x: auto;
      scrollbar-width: none;
      padding-bottom: 0.1rem;
      max-height: 2.4rem;
    }

    .post-game-footer__secondary::-webkit-scrollbar {
      display: none;
    }

    .post-game-footer__replay-actions {
      margin-left: 0;
      gap: 0.35rem;
      flex-shrink: 0;
    }

    .post-game-footer__replay-actions :global([data-slot="button"]) {
      flex: 0 0 auto;
      min-height: 2.1rem;
      font-size: 0.72rem;
      padding-inline: 0.55rem;
    }

    /* Drop the verbose "Help us improve" label on mobile; the icon buttons
       speak for themselves and we need every pixel for the primary CTA. */
    .post-game-feedback-prompt {
      flex-direction: row;
      align-items: center;
      gap: 0.4rem;
      margin-right: 0;
      flex-shrink: 0;
    }

    .post-game-feedback-prompt__label {
      display: none;
    }

    .post-game-feedback-prompt__actions {
      gap: 0.35rem;
      flex-wrap: nowrap;
    }

    .post-game-feedback-btn {
      padding: 0.32rem 0.55rem;
      font-size: 0.68rem;
      gap: 0.3rem;
    }

    .post-game-series-info {
      display: none;
    }

    .post-game-footer__primary {
      grid-template-columns: auto 1fr;
      gap: 0.4rem;
    }

    :global(.post-game-footer__cta) {
      min-height: 2.85rem;
      font-size: 0.92rem;
    }

    :global(.post-game-footer__close) {
      min-height: 2.85rem;
      padding-inline: 0.85rem;
    }

    .post-game-notes__actions :global([data-slot="button"]) {
      flex: 1 1 100%;
    }
  }
</style>
