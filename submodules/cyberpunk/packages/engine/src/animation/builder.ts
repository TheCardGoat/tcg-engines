import type { GameEvent } from "../types/game-events.ts";
import type { CardInstanceId, GigDieId } from "../types/branded.ts";
import type { CardZone } from "@tcg/cyberpunk-types";
import type { CommandEnvelope, MatchState } from "../types/index.ts";
import type { MoveLog } from "../logging/move-log.ts";
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
      for (const cardId of ev.cardIds) {
        revealed.add(cardId);
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
  if (events.length === 0) {
    return EMPTY_ANIMATION_SCRIPT;
  }

  const scan = prescan(events);
  const resolvingSourceCardId = context ? pendingChoiceSourceCardId(context.toState) : undefined;
  const steps: AnimationStep[] = [];
  let cursor = 0;
  let totalEnd = 0;
  let nextId = 0;
  const hasAttackResolved = events.some((ev) => ev.type === "attackResolved");
  const pendingCombatConsequences: GameEvent[] = [];
  const id = () => `step-${nextId++}`;
  const advance = (duration: number) => {
    cursor += duration;
    totalEnd = Math.max(totalEnd, cursor);
  };
  const parallel = (duration: number) => {
    totalEnd = Math.max(totalEnd, cursor + duration);
  };
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
        const duration = ANIMATION_DURATIONS_MS.cardMove;
        steps.push({
          kind: "cardMove",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "cardMoved",
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
        if (ev.cardIds.length === 0) break;
        const stagger = ANIMATION_DURATIONS_MS.drawStaggerMs;
        const each = ANIMATION_DURATIONS_MS.cardReveal;
        for (let i = 0; i < ev.cardIds.length; i++) {
          const cardId = ev.cardIds[i]!;
          const destination = scan.revealedDestinations.get(cardId);
          steps.push({
            kind: "cardReveal",
            id: id(),
            startMs: cursor + i * stagger,
            durationMs: each,
            reason: "cardsRevealed",
            cardId,
            fromZone: "deck",
            ...(destination ? { toZone: destination } : {}),
            playerId: ev.playerId,
          });
        }
        advance((ev.cardIds.length - 1) * stagger + each);
        break;
      }
      case "cardsDrawn": {
        if (ev.cardIds.length === 0) break;
        const stagger = ANIMATION_DURATIONS_MS.drawStaggerMs;
        const each = ANIMATION_DURATIONS_MS.cardEnter;
        for (let i = 0; i < ev.cardIds.length; i++) {
          steps.push({
            kind: "cardEnter",
            id: id(),
            startMs: cursor + i * stagger,
            durationMs: each,
            reason: "cardsDrawn",
            cardId: ev.cardIds[i]!,
            toZone: "hand",
            playerId: ev.playerId,
          });
        }
        // Total run: last stagger + duration. Advance cursor by that.
        const total = (ev.cardIds.length - 1) * stagger + each;
        advance(total);
        break;
      }
      case "attackResolved": {
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
        const duration = ANIMATION_DURATIONS_MS.effectTarget;
        const sourceCard = context?.fromState.G.cardIndex[ev.sourceCardId as string];
        const defeatedTarget = events.some(
          (candidate) =>
            candidate.type === "cardDefeated" &&
            candidate.defeatedBy === ev.sourceCardId &&
            ev.targets.some(
              (target) => target.kind === "card" && target.cardId === candidate.cardId,
            ),
        );
        const stageSource = sourceCard?.zone === "trash";
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
          ...(stageSource
            ? {
                presentation: "source-card" as const,
                sourceExit: { zone: "trash" as const, playerId: sourceCard.ownerId },
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
