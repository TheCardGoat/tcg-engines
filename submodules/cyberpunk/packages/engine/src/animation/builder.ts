import type { GameEvent } from "../types/game-events.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import type { CardZone } from "@tcg/cyberpunk-types";
import type { CommandEnvelope, MatchState } from "../types/index.ts";
import type { MoveLog } from "../logging/move-log.ts";
import { defOf } from "../state/lookups.ts";
import { ANIMATION_DURATIONS_MS } from "./durations.ts";
import {
  type AnimationScript,
  type AnimationStep,
  type CardExitReason,
  EMPTY_ANIMATION_SCRIPT,
} from "./types.ts";

interface ExitDecision {
  reason: CardExitReason;
  originEventType: "cardDefeated" | "cardSold";
  fromZone: CardZone;
  toZone: CardZone;
}

interface PreScan {
  exits: Map<CardInstanceId, ExitDecision>;
  /** cardId -> destination for cards moved after a public reveal in this command. */
  revealedDestinations: Map<CardInstanceId, CardZone>;
  /** gearId -> hostId for cards being attached in this command. */
  attached: Map<CardInstanceId, CardInstanceId>;
  /** gearId -> hostId for cards detached in this command. */
  detachedFrom: Map<CardInstanceId, CardInstanceId>;
  /** dieIds already represented by a gigStolen step. */
  stolenGigs: Set<GigDieId>;
  /** Legends whose face reveal owns any simultaneous spend animation. */
  calledLegends: Set<CardInstanceId>;
  spentCards: Set<CardInstanceId>;
}

export interface BuildAnimationScriptContext {
  readonly command: CommandEnvelope;
  readonly actorId: PlayerId;
  readonly fromState: MatchState;
  readonly toState: MatchState;
  readonly events: ReadonlyArray<GameEvent>;
  readonly moveLogs: ReadonlyArray<MoveLog>;
}

function prescan(events: ReadonlyArray<GameEvent>): PreScan {
  const exits = new Map<CardInstanceId, ExitDecision>();
  const moves = new Map<CardInstanceId, { fromZone: CardZone; toZone: CardZone }>();
  const revealed = new Set<CardInstanceId>();
  const revealedDestinations = new Map<CardInstanceId, CardZone>();
  const attached = new Map<CardInstanceId, CardInstanceId>();
  const detachedFrom = new Map<CardInstanceId, CardInstanceId>();
  const stolenGigs = new Set<GigDieId>();
  const calledLegends = new Set<CardInstanceId>();
  const spentCards = new Set<CardInstanceId>();
  for (const ev of events) {
    if (ev.type === "cardsRevealed") {
      if (ev.fromZone === "deck") {
        for (const cardId of ev.cardIds) revealed.add(cardId);
      }
    } else if (ev.type === "cardDefeated") {
      const move = moves.get(ev.cardId);
      exits.set(ev.cardId, {
        reason: "defeated",
        originEventType: "cardDefeated",
        fromZone: move?.fromZone ?? "field",
        toZone: move?.toZone ?? "trash",
      });
    } else if (ev.type === "cardSold") {
      const move = moves.get(ev.cardId);
      exits.set(ev.cardId, {
        reason: "sold",
        originEventType: "cardSold",
        fromZone: move?.fromZone ?? "hand",
        toZone: move?.toZone ?? "trash",
      });
    } else if (ev.type === "cardMoved") {
      moves.set(ev.cardId, { fromZone: ev.fromZone, toZone: ev.toZone });
      if (revealed.has(ev.cardId) && ev.fromZone === "deck") {
        revealedDestinations.set(ev.cardId, ev.toZone);
      }
      const exit = exits.get(ev.cardId);
      if (exit) {
        exits.set(ev.cardId, { ...exit, fromZone: ev.fromZone, toZone: ev.toZone });
      }
    } else if (ev.type === "cardAttached") {
      attached.set(ev.gearId, ev.hostId);
    } else if (ev.type === "cardDetached") {
      detachedFrom.set(ev.gearId, ev.hostId);
    } else if (ev.type === "gigStolen") {
      stolenGigs.add(ev.dieId);
    } else if (ev.type === "legendCalled") {
      calledLegends.add(ev.cardId);
    } else if (ev.type === "cardSpent") {
      spentCards.add(ev.cardId);
    }
  }
  return {
    exits,
    revealedDestinations,
    attached,
    detachedFrom,
    stolenGigs,
    calledLegends,
    spentCards,
  };
}

/**
 * Pure, deterministic projection of engine `GameEvent`s into an
 * `AnimationScript`. Called once per command from the engine's command
 * processor after `gameEvents` are accumulated.
 *
 * Sequencing rules:
 * - `cardMove`, `cardExit`, `cardAttach` steps are sequential (advance the cursor).
 * - `resourceFloat` steps run in parallel with the surrounding move
 *   (cursor is not advanced, but `totalDurationMs` includes them).
 * - `cardSpent`/`cardReadied` rotations run in parallel with surrounding
 *   movement so payment and turn-start readiness remain part of one gesture.
 *
 * Suppression rules:
 * - `cardMoved` whose `cardId` matches a `cardDefeated`/`cardSold` in the
 *   same batch is suppressed in favour of the exit step.
 * - `cardMoved` whose `cardId` matches a `cardAttached` (gear) is
 *   suppressed; the `cardAttach` step owns motion.
 *
 * Targeting film overlaps its consequences at the impact beat so causality is
 * readable without serializing the whole command. Combat consequences still
 * wait until `attackResolved` so exits follow impact order.
 */
export function buildAnimationScript(
  input: ReadonlyArray<GameEvent> | BuildAnimationScriptContext,
): AnimationScript {
  let context: BuildAnimationScriptContext | null;
  let events: ReadonlyArray<GameEvent>;
  if (isBuildAnimationScriptContext(input)) {
    context = input;
    events = input.events;
  } else {
    context = null;
    events = input as ReadonlyArray<GameEvent>;
  }
  if (events.length === 0 && !context) {
    return EMPTY_ANIMATION_SCRIPT;
  }

  const scan = prescan(events);
  const resolvingSourceCardId = context ? pendingChoiceSourceCardId(context.toState) : undefined;
  const playedProgramIds = new Set<CardInstanceId>();
  const continuingProgramIds = new Set<CardInstanceId>();
  const pendingProgramIds = new Set<CardInstanceId>();
  if (context) {
    for (const event of events) {
      if (event.type !== "cardPlayed") continue;
      const card = context.fromState.G.cardIndex[event.cardId as string];
      if (card && defOf(card).type === "program") playedProgramIds.add(event.cardId);
    }
    for (const [state, ids] of [
      [context.fromState, continuingProgramIds],
      [context.toState, pendingProgramIds],
    ] as const) {
      const sourceCardId = pendingChoiceSourceCardId(state);
      const sourceCard = sourceCardId ? state.G.cardIndex[sourceCardId as string] : undefined;
      if (sourceCardId && sourceCard && defOf(sourceCard).type === "program") {
        ids.add(sourceCardId);
      }
    }
  }
  // The Program is already on the resolving stage while a target choice is open.
  // Resolving that choice does not move the card again, but it still needs a
  // stage-to-destination transfer when the effect finishes.
  const stagedProgramIds = new Set<CardInstanceId>(continuingProgramIds);
  const resolvedSourceFinalZones = new Map<CardInstanceId, CardZone>();
  const finalDeckPlacements = new Map<CardInstanceId, "top" | "bottom" | undefined>();
  for (const event of events) {
    if (event.type === "cardMoved") finalDeckPlacements.set(event.cardId, event.deckPlacement);
  }
  const programEffectEndMs = new Map<CardInstanceId, number>();
  const effectSourceIds = new Set(
    events.flatMap((event) => (event.type === "effectTargeted" ? [event.sourceCardId] : [])),
  );
  for (const event of events) {
    if (
      event.type === "cardMoved" &&
      (playedProgramIds.has(event.cardId) ||
        continuingProgramIds.has(event.cardId) ||
        effectSourceIds.has(event.cardId))
    ) {
      resolvedSourceFinalZones.set(event.cardId, event.toZone);
    }
  }
  const steps: AnimationStep[] = [];
  let cursor = 0;
  let totalEnd = 0;
  let nextId = 0;
  const hasAttackResolved = events.some((ev) => ev.type === "attackResolved");
  const defeatedCardIds = new Set(
    events.flatMap((ev) => (ev.type === "cardDefeated" ? [ev.cardId] : [])),
  );
  const pendingCombatConsequences: GameEvent[] = [];
  const id = () => `step-${nextId++}`;
  const advance = (duration: number) => {
    cursor += duration;
    totalEnd = Math.max(totalEnd, cursor);
  };
  const parallel = (duration: number) => {
    totalEnd = Math.max(totalEnd, cursor + duration);
  };
  const pushActionEmphasis = (
    reason: string,
    target: Extract<AnimationStep, { kind: "actionEmphasis" }>["target"],
    tone: "neutral" | "positive" = "neutral",
  ) => {
    const duration = ANIMATION_DURATIONS_MS.actionEmphasis;
    steps.push({
      kind: "actionEmphasis",
      id: id(),
      startMs: cursor,
      durationMs: duration,
      reason,
      target,
      tone,
    });
    advance(duration);
  };
  if (context?.command.move === "keepHand") {
    pushActionEmphasis(
      "keepHand",
      { kind: "zone", zone: "hand", playerId: context.actorId },
      "positive",
    );
  }
  const pushCardExit = (ev: Extract<GameEvent, { type: "cardDefeated" | "cardSold" }>) => {
    const exit = scan.exits.get(ev.cardId);
    const duration = ANIMATION_DURATIONS_MS.cardExit;
    const sold = ev.type === "cardSold";
    steps.push({
      kind: "cardExit",
      id: id(),
      startMs: cursor,
      durationMs: duration,
      reason: ev.type,
      cardId: ev.cardId,
      fromZone: exit?.fromZone ?? (sold ? "hand" : "field"),
      toZone: exit?.toZone ?? "trash",
      playerId: ev.playerId,
      exitReason: sold ? "sold" : "defeated",
      ...(scan.detachedFrom.get(ev.cardId) ? { fromHostId: scan.detachedFrom.get(ev.cardId) } : {}),
    });
    advance(duration);
  };
  const pushGigMove = (ev: Extract<GameEvent, { type: "gigStolen" | "gigDieMoved" }>) => {
    const duration = ANIMATION_DURATIONS_MS.gigMove;
    if (ev.type === "gigStolen") {
      steps.push({
        kind: "gigMove",
        id: id(),
        startMs: cursor,
        durationMs: duration,
        reason: "gigStolen",
        dieId: ev.dieId,
        from: "gigArea",
        to: "gigArea",
        fromPlayerId: ev.fromPlayerId,
        toPlayerId: ev.toPlayerId,
        moveKind: "steal",
      });
      advance(duration);
      return;
    }
    const from = ev.from === "fixerArea" ? "fixerArea" : "gigArea";
    const to = ev.to === "fixerArea" ? "fixerArea" : "gigArea";
    const isGain = from === "fixerArea" && to === "gigArea" && ev.fromPlayerId === undefined;
    steps.push({
      kind: "gigMove",
      id: id(),
      startMs: cursor,
      durationMs: duration,
      reason: "gigDieMoved",
      dieId: ev.dieId,
      from,
      to,
      fromPlayerId: ev.fromPlayerId ?? ev.playerId,
      toPlayerId: ev.playerId,
      moveKind: isGain ? "gain" : "correct",
    });
    advance(duration);
  };
  const flushPendingCombatConsequences = () => {
    while (pendingCombatConsequences.length > 0) {
      const consequence = pendingCombatConsequences.shift()!;
      if (consequence.type === "cardDefeated" || consequence.type === "cardSold") {
        pushCardExit(consequence);
      } else if (consequence.type === "gigStolen") {
        pushGigMove(consequence);
      }
    }
  };

  for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
    const ev = events[eventIndex]!;
    switch (ev.type) {
      case "cardMoved": {
        if (continuingProgramIds.has(ev.cardId)) {
          stagedProgramIds.add(ev.cardId);
          resolvedSourceFinalZones.set(ev.cardId, ev.toZone);
          break;
        }
        if (playedProgramIds.has(ev.cardId)) {
          if (!stagedProgramIds.has(ev.cardId)) {
            stagedProgramIds.add(ev.cardId);
            const duration =
              ev.fromZone === "hand"
                ? ANIMATION_DURATIONS_MS.handPlay
                : ANIMATION_DURATIONS_MS.cardMove;
            steps.push({
              kind: "cardMove",
              id: id(),
              startMs: cursor,
              durationMs: duration,
              reason: "programRevealedForResolution",
              cardId: ev.cardId,
              fromZone: ev.fromZone,
              toZone: ev.toZone,
              playerId: ev.playerId,
              sourceFace: "public",
              destinationFace: "public",
              presentation: "resolving-effect",
            });
            advance(duration);
            advance(ANIMATION_DURATIONS_MS.programRevealHoldMs);
          }
          break;
        }
        if (scan.revealedDestinations.has(ev.cardId) && ev.fromZone === "deck") {
          // Suppressed — the cardReveal step owns the reveal + destination settle.
          break;
        }
        if (scan.exits.has(ev.cardId)) {
          // Suppressed — a cardExit step will cover this card.
          break;
        }
        if (scan.attached.has(ev.cardId)) {
          // Suppressed — a cardAttach step will cover this gear.
          break;
        }
        const duration =
          ev.fromZone === "hand" && ev.toZone === "field"
            ? ANIMATION_DURATIONS_MS.handPlay
            : ANIMATION_DURATIONS_MS.cardMove;
        steps.push({
          kind: "cardMove",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "cardMoved",
          deckPlacement: ev.deckPlacement,
          cardId: ev.cardId,
          fromZone: ev.fromZone,
          toZone: ev.toZone,
          playerId: ev.playerId,
          ...(scan.detachedFrom.get(ev.cardId)
            ? { fromHostId: scan.detachedFrom.get(ev.cardId) }
            : {}),
          ...(ev.cardId === resolvingSourceCardId && ev.fromZone === "hand" && ev.toZone === "trash"
            ? { presentation: "resolving-effect" as const }
            : {}),
        });
        advance(duration);
        break;
      }
      case "cardAttached": {
        const duration = ANIMATION_DURATIONS_MS.cardAttach;
        steps.push({
          kind: "cardAttach",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "cardAttached",
          gearId: ev.gearId,
          hostId: ev.hostId,
          playerId: ev.playerId,
        });
        advance(duration);
        break;
      }
      case "cardDefeated": {
        if (hasAttackResolved) {
          pendingCombatConsequences.push(ev);
          break;
        }
        pushCardExit(ev);
        break;
      }
      case "cardSold": {
        pushCardExit(ev);
        break;
      }
      case "ruleGranted": {
        // A rule grant moves no card; it deserves a debuff beat on the
        // affected card without gating the beats that follow it.
        if (ev.rule !== "cantAttack") break;
        const duration = ANIMATION_DURATIONS_MS.actionEmphasis;
        steps.push({
          kind: "actionEmphasis",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "ruleGranted:cantAttack",
          target: { kind: "card", cardId: ev.cardId },
          tone: "negative",
          label: "CAN'T ATTACK",
        });
        parallel(duration);
        break;
      }
      case "legendCalled": {
        const duration = ANIMATION_DURATIONS_MS.legendReveal;
        const fromSpent = context?.fromState.G.cardIndex[ev.cardId as string]?.meta.spent ?? false;
        const toSpent =
          context?.toState.G.cardIndex[ev.cardId as string]?.meta.spent ??
          (fromSpent || scan.spentCards.has(ev.cardId));
        steps.push({
          kind: "legendReveal",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "legendCalled",
          cardId: ev.cardId,
          playerId: ev.playerId,
          fromRotationDeg: fromSpent ? 90 : 0,
          toRotationDeg: toSpent ? 90 : 0,
        });
        advance(duration);
        break;
      }
      case "cardsRevealed": {
        const revealedCardIds = ev.cardIds.filter((cardId) => !playedProgramIds.has(cardId));
        if (revealedCardIds.length === 0) break;
        const stagger = ANIMATION_DURATIONS_MS.drawStaggerMs;
        const each = ANIMATION_DURATIONS_MS.cardReveal;
        for (let i = 0; i < revealedCardIds.length; i++) {
          const cardId = revealedCardIds[i]!;
          const destination =
            ev.fromZone === "deck" ? scan.revealedDestinations.get(cardId) : undefined;
          const deckPlacement = finalDeckPlacements.get(cardId);
          steps.push({
            kind: "cardReveal",
            id: id(),
            startMs: cursor + i * stagger,
            durationMs: each,
            reason: "cardsRevealed",
            cardId,
            fromZone: ev.fromZone,
            ...(destination ? { toZone: destination } : {}),
            ...(destination === "deck" && deckPlacement ? { deckPlacement } : {}),
            audience: ev.audience,
            viewerId: ev.playerId,
            ...(ev.viewers?.length ? { viewerIds: ev.viewers } : {}),
            ownerId: ev.ownerId,
            ...(ev.sourceCardId ? { sourceCardId: ev.sourceCardId } : {}),
          });
        }
        advance((revealedCardIds.length - 1) * stagger + each);
        break;
      }
      case "cardsDrawn": {
        if (ev.cardIds.length === 0) break;
        const each = ANIMATION_DURATIONS_MS.cardEnter;
        for (const cardId of ev.cardIds) {
          steps.push({
            kind: "cardEnter",
            id: id(),
            startMs: cursor,
            durationMs: each,
            reason: "cardsDrawn",
            cardId,
            toZone: "hand",
            playerId: ev.playerId,
          });
        }
        advance(each);
        break;
      }
      case "attackDeclared": {
        // Automatic combat progression can chain the declare, block and result
        // into one command's event list; play each beat in event order instead
        // of collapsing to the resolution only.
        const duration = ANIMATION_DURATIONS_MS.combatDeclare;
        steps.push({
          kind: "combat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "attackDeclared",
          attackerId: ev.attackerId,
          defenderId: ev.defenderId,
          rivalId: ev.rivalId,
          attackKind: ev.attackKind,
          playerId: ev.playerId,
        });
        advance(duration);
        break;
      }
      case "blockerActivated": {
        // The redirect beat must play even when the fight resolves in the same
        // command — the viewer needs to see the block before the impact and the
        // defeated attacker's exit (both deferred below).
        const duration = ANIMATION_DURATIONS_MS.combatDeclare;
        steps.push({
          kind: "combatRedirect",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "blockerActivated",
          attackerId: ev.attackerId,
          blockerId: ev.blockerId,
          originalTargetId: ev.originalTarget,
          playerId: ev.playerId,
        });
        advance(duration);
        break;
      }
      case "attackResolved": {
        const duration = ANIMATION_DURATIONS_MS.combatResolve;
        steps.push({
          kind: "combat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "attackResolved",
          attackerId: ev.attackerId,
          defenderId: ev.defenderId,
          rivalId: ev.rivalId,
          attackKind: ev.attackKind,
          result: ev.result,
          defeatedCardIds: [ev.attackerId, ...(ev.defenderId ? [ev.defenderId] : [])].filter(
            (cardId) => defeatedCardIds.has(cardId),
          ),
          ...(ev.preventedCardIds?.length ? { preventedCardIds: ev.preventedCardIds } : {}),
          ...(ev.gigsStolen !== undefined ? { gigsStolen: ev.gigsStolen } : {}),
          playerId: ev.playerId,
        });
        advance(duration);
        flushPendingCombatConsequences();
        break;
      }
      case "gigStolen": {
        if (hasAttackResolved) {
          pendingCombatConsequences.push(ev);
          break;
        }
        pushGigMove(ev);
        break;
      }
      case "gigDieMoved": {
        if (scan.stolenGigs.has(ev.dieId)) {
          // Suppressed — gigStolen carries both the source and destination players.
          break;
        }
        pushGigMove(ev);
        break;
      }
      case "deckShuffled": {
        const duration = ANIMATION_DURATIONS_MS.randomization;
        steps.push({
          kind: "randomization",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "deckShuffled",
          playerId: ev.playerId,
          randomization: "shuffle",
          zone: "deck",
        });
        advance(duration);
        break;
      }
      case "deckCardsPlaced":
        pushActionEmphasis("deckCardsPlaced", {
          kind: "zone",
          zone: "deck",
          playerId: ev.playerId,
        });
        break;
      case "phaseChanged": {
        const duration = ANIMATION_DURATIONS_MS.phaseChange;
        const nextEvent = events[eventIndex + 1];
        const turnStarted =
          ev.from === "main" && ev.to === "start" && nextEvent?.type === "turnStarted"
            ? nextEvent
            : null;
        steps.push({
          kind: "phaseChange",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "phaseChanged",
          from: ev.from,
          to: ev.to,
          playerId: ev.playerId,
          ...(turnStarted
            ? {
                variant: "turn" as const,
                turnPlayerId: turnStarted.playerId,
                turnNumber: turnStarted.turnNumber,
              }
            : {}),
        });
        // The turn banner is feedback, not a gate: the readies and draw that
        // follow must play underneath it instead of queuing behind 1.5s.
        if (turnStarted) {
          parallel(duration);
        } else {
          advance(duration);
        }
        break;
      }
      case "legendsShuffled": {
        const duration = ANIMATION_DURATIONS_MS.randomization;
        steps.push({
          kind: "randomization",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "legendsShuffled",
          playerId: ev.playerId,
          randomization: "shuffle",
          zone: "legendArea",
        });
        parallel(duration);
        break;
      }
      case "cardSpent":
      case "cardReadied": {
        if (ev.type === "cardSpent" && scan.calledLegends.has(ev.cardId)) {
          // The Legend reveal combines the face flip and orientation change;
          // two overlays on the same card produce doubled, conflicting clones.
          break;
        }
        const duration = ANIMATION_DURATIONS_MS.entityStateChange;
        steps.push({
          kind: "entityStateChange",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: ev.type,
          cardId: ev.cardId,
          playerId: ev.playerId,
          change: ev.type === "cardSpent" ? "spent" : "readied",
        });
        parallel(duration);
        break;
      }
      case "eddiesSpent": {
        const duration = ANIMATION_DURATIONS_MS.resourceFloat;
        steps.push({
          kind: "resourceFloat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "eddiesSpent",
          resource: "eddies",
          playerId: ev.playerId,
          delta: -ev.amount,
        });
        parallel(duration);
        break;
      }
      case "eddiesGained": {
        const duration = ANIMATION_DURATIONS_MS.resourceFloat;
        steps.push({
          kind: "resourceFloat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "eddiesGained",
          resource: "eddies",
          playerId: ev.playerId,
          delta: ev.amount,
        });
        parallel(duration);
        break;
      }
      case "gigValueChanged": {
        const delta = ev.newValue - ev.previousValue;
        if (delta === 0) {
          break;
        }
        const duration = ANIMATION_DURATIONS_MS.resourceFloat;
        steps.push({
          kind: "resourceFloat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "gigValueChanged",
          resource: "gig",
          playerId: ev.playerId,
          delta,
          dieId: ev.dieId,
          previousValue: ev.previousValue,
          newValue: ev.newValue,
        });
        parallel(duration);
        break;
      }
      case "effectTargeted": {
        if (ev.targets.length === 0) break;
        const isResolvingProgram =
          playedProgramIds.has(ev.sourceCardId) || continuingProgramIds.has(ev.sourceCardId);
        const duration = ANIMATION_DURATIONS_MS.effectTarget;
        if (isResolvingProgram) {
          programEffectEndMs.set(ev.sourceCardId, cursor + duration);
        }
        const sourceCard = context?.fromState.G.cardIndex[ev.sourceCardId as string];
        const defeatedTarget = events.some(
          (candidate) =>
            candidate.type === "cardDefeated" &&
            candidate.defeatedBy === ev.sourceCardId &&
            ev.targets.some(
              (target) => target.kind === "card" && target.cardId === candidate.cardId,
            ),
        );
        const stageSource = sourceCard?.zone === "trash" && !isResolvingProgram;
        steps.push({
          kind: "effectTarget",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "effectTargeted",
          sourceCardId: ev.sourceCardId,
          targets: ev.targets,
          playerId: ev.playerId,
          label: defeatedTarget ? "Defeat" : "Effect",
          tone: defeatedTarget ? "negative" : "neutral",
          ...(isResolvingProgram ? { presentation: "resolving-program" as const } : {}),
          ...(stageSource
            ? {
                presentation: "source-card" as const,
                sourceExit: {
                  zone:
                    resolvedSourceFinalZones.get(ev.sourceCardId) ?? sourceCard?.zone ?? "trash",
                  playerId: sourceCard?.ownerId ?? ev.playerId,
                },
              }
            : {}),
        });
        parallel(duration);
        advance(ANIMATION_DURATIONS_MS.effectTargetImpactDelayMs);
        break;
      }
      default:
        break;
    }
  }

  flushPendingCombatConsequences();

  for (const cardId of stagedProgramIds) {
    if (pendingProgramIds.has(cardId)) continue;
    const effectEndMs = programEffectEndMs.get(cardId);
    if (effectEndMs !== undefined && effectEndMs > cursor) {
      advance(effectEndMs - cursor);
    }
    const source = context?.fromState.G.cardIndex[cardId as string];
    if (!source) continue;
    const duration = ANIMATION_DURATIONS_MS.cardMove;
    const destinationZone =
      resolvedSourceFinalZones.get(cardId) ??
      context?.toState.G.cardIndex[cardId as string]?.zone ??
      "trash";
    steps.push({
      kind: "cardMove",
      id: id(),
      startMs: cursor,
      durationMs: duration,
      reason: "programResolutionCompleted",
      deckPlacement: finalDeckPlacements.get(cardId),
      cardId,
      fromZone: source.zone,
      toZone: destinationZone,
      playerId: source.ownerId,
      sourceFace: "public",
      destinationFace: destinationZone === "deck" ? "hidden" : "public",
      presentation: "resolved-effect",
    });
    advance(duration);
  }

  if (steps.length === 0 && context) {
    switch (context.command.move) {
      case "activateAbility":
      case "resolveTrigger": {
        const sourceId =
          context.toState.G.turnMetadata.currentTrigger?.sourceCardId ??
          context.fromState.G.turnMetadata.currentTrigger?.sourceCardId;
        const source = sourceId
          ? (context.toState.G.cardIndex[sourceId as string] ??
            context.fromState.G.cardIndex[sourceId as string])
          : undefined;
        pushActionEmphasis(
          context.command.move,
          sourceId && (source?.zone === "field" || source?.zone === "legendArea")
            ? { kind: "card", cardId: sourceId }
            : { kind: "zone", zone: "field", playerId: context.actorId },
        );
        break;
      }
      case "resolveScry":
        pushActionEmphasis("resolveScry", {
          kind: "zone",
          zone: "deck",
          playerId: context.actorId,
        });
        break;
      case "resolveAttack":
        pushActionEmphasis("resolveAttack", {
          kind: "zone",
          zone: "field",
          playerId: context.actorId,
        });
        break;
      case "resolveChooseEffect": {
        const choice = context.fromState.G.turnMetadata.pendingChoice;
        if (choice?.type !== "chooseEffect") break;
        const sourceId = choice.payload.sourceCardId;
        const source = context.fromState.G.cardIndex[sourceId as string];
        if (!source) break;
        if (source.zone === "field" || source.zone === "legendArea") {
          pushActionEmphasis("resolveChooseEffect", { kind: "card", cardId: sourceId });
        } else if (source.zone === "hand" || source.zone === "deck" || source.zone === "trash") {
          pushActionEmphasis("resolveChooseEffect", {
            kind: "zone",
            zone: source.zone,
            playerId: source.ownerId,
          });
        }
        break;
      }
    }
  }

  return {
    steps,
    totalDurationMs: totalEnd,
  };
}

function pendingChoiceSourceCardId(state: MatchState): CardInstanceId | undefined {
  const choice = state.G.turnMetadata.pendingChoice;
  if (!choice || !("payload" in choice) || !("sourceCardId" in choice.payload)) {
    return undefined;
  }
  return choice.payload.sourceCardId;
}

function isBuildAnimationScriptContext(
  input: ReadonlyArray<GameEvent> | BuildAnimationScriptContext,
): input is BuildAnimationScriptContext {
  return input !== null && typeof input === "object" && !Array.isArray(input) && "events" in input;
}
