import type { GameEvent } from "../types/game-events.ts";
import type { CardInstanceId, GigDieId } from "../types/branded.ts";
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
}

interface PreScan {
  exits: Map<CardInstanceId, ExitDecision>;
  /** gearId -> hostId for cards being attached in this command. */
  attached: Map<CardInstanceId, CardInstanceId>;
  /** cardIds with a cardPlayed event in this command — used to emit cardLand. */
  played: Set<CardInstanceId>;
  /** dieIds already represented by a gigStolen step. */
  stolenGigs: Set<GigDieId>;
}

function prescan(events: ReadonlyArray<GameEvent>): PreScan {
  const exits = new Map<CardInstanceId, ExitDecision>();
  const attached = new Map<CardInstanceId, CardInstanceId>();
  const played = new Set<CardInstanceId>();
  const stolenGigs = new Set<GigDieId>();
  for (const ev of events) {
    if (ev.type === "cardDefeated") {
      exits.set(ev.cardId, { reason: "defeated", originEventType: "cardDefeated" });
    } else if (ev.type === "cardSold") {
      exits.set(ev.cardId, { reason: "sold", originEventType: "cardSold" });
    } else if (ev.type === "cardAttached") {
      attached.set(ev.gearId, ev.hostId);
    } else if (ev.type === "cardPlayed") {
      played.add(ev.cardId);
    } else if (ev.type === "gigStolen") {
      stolenGigs.add(ev.dieId);
    }
  }
  return { exits, attached, played, stolenGigs };
}

/**
 * Pure, deterministic projection of engine `GameEvent`s into an
 * `AnimationScript`. Called once per command from the engine's command
 * processor after `gameEvents` are accumulated.
 *
 * Sequencing rules:
 * - `cardMove`, `cardExit`, `cardAttach`, `effectTarget`, `cardLand` steps
 *   are sequential (advance the cursor).
 * - `resourceFloat` steps run in parallel with the surrounding move
 *   (cursor is not advanced, but `totalDurationMs` includes them).
 *
 * Suppression rules:
 * - `cardMoved` whose `cardId` matches a `cardDefeated`/`cardSold` in the
 *   same batch is suppressed in favour of the exit step.
 * - `cardMoved` whose `cardId` matches a `cardAttached` (gear) is
 *   suppressed; the `cardAttach` step owns motion + emphasis.
 *
 * Emphasis rules:
 * - After a `cardMove` whose destination is `field` for a `cardPlayed`
 *   card (i.e. a unit landing), emit a `cardLand` step for a subtle
 *   pulse on the just-played card.
 */
export function buildAnimationScript(events: ReadonlyArray<GameEvent>): AnimationScript {
  if (events.length === 0) {
    return EMPTY_ANIMATION_SCRIPT;
  }

  const scan = prescan(events);
  const steps: AnimationStep[] = [];
  let cursor = 0;
  let totalEnd = 0;
  let nextId = 0;
  const id = () => `step-${nextId++}`;
  const advance = (duration: number) => {
    cursor += duration;
    totalEnd = Math.max(totalEnd, cursor);
  };
  const parallel = (duration: number) => {
    totalEnd = Math.max(totalEnd, cursor + duration);
  };

  for (const ev of events) {
    switch (ev.type) {
      case "cardMoved": {
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
        });
        advance(duration);
        // If this move lands a played card on the field, follow with a
        // brief landing pulse so the "I just played this" beat reads.
        if (ev.toZone === "field" && scan.played.has(ev.cardId)) {
          const landDur = ANIMATION_DURATIONS_MS.cardLand;
          steps.push({
            kind: "cardLand",
            id: id(),
            startMs: cursor,
            durationMs: landDur,
            reason: "cardPlayed",
            cardId: ev.cardId,
            playerId: ev.playerId,
          });
          advance(landDur);
        }
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
        const duration = ANIMATION_DURATIONS_MS.cardExit;
        steps.push({
          kind: "cardExit",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "cardDefeated",
          cardId: ev.cardId,
          fromZone: "field",
          playerId: ev.playerId,
          exitReason: "defeated",
        });
        advance(duration);
        break;
      }
      case "cardSold": {
        const duration = ANIMATION_DURATIONS_MS.cardExit;
        steps.push({
          kind: "cardExit",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "cardSold",
          cardId: ev.cardId,
          fromZone: "hand",
          playerId: ev.playerId,
          exitReason: "sold",
        });
        advance(duration);
        break;
      }
      case "effectTargeted": {
        if (ev.targets.length === 0) break;
        const duration = ANIMATION_DURATIONS_MS.effectTarget;
        steps.push({
          kind: "effectTarget",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "effectTargeted",
          sourceCardId: ev.sourceCardId,
          targets: ev.targets,
          playerId: ev.playerId,
        });
        advance(duration);
        break;
      }
      case "legendCalled": {
        const duration = ANIMATION_DURATIONS_MS.legendReveal;
        steps.push({
          kind: "legendReveal",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "legendCalled",
          cardId: ev.cardId,
          playerId: ev.playerId,
        });
        advance(duration);
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
      case "attackDeclared": {
        const duration = ANIMATION_DURATIONS_MS.combatDeclare;
        steps.push({
          kind: "combat",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "attackDeclared",
          attackerId: ev.attackerId,
          defenderId: ev.defenderId,
          attackKind: ev.attackKind,
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
          attackKind: ev.attackKind,
          playerId: ev.playerId,
        });
        advance(duration);
        break;
      }
      case "gigStolen": {
        const duration = ANIMATION_DURATIONS_MS.gigMove;
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
        break;
      }
      case "gigDieMoved": {
        if (scan.stolenGigs.has(ev.dieId)) {
          // Suppressed — gigStolen carries both the source and destination players.
          break;
        }
        if (ev.from !== "fixerArea" || ev.to !== "gigArea") {
          break;
        }
        const duration = ANIMATION_DURATIONS_MS.gigMove;
        steps.push({
          kind: "gigMove",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "gigDieMoved",
          dieId: ev.dieId,
          from: "fixerArea",
          to: "gigArea",
          fromPlayerId: ev.playerId,
          toPlayerId: ev.playerId,
          moveKind: "gain",
        });
        advance(duration);
        break;
      }
      case "phaseChanged": {
        const duration = ANIMATION_DURATIONS_MS.phaseChange;
        steps.push({
          kind: "phaseChange",
          id: id(),
          startMs: cursor,
          durationMs: duration,
          reason: "phaseChanged",
          from: ev.from,
          to: ev.to,
          playerId: ev.playerId,
        });
        advance(duration);
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
      // Phase 2+ — events we don't yet animate. Intentionally fall through.
      default:
        break;
    }
  }

  return {
    steps,
    totalDurationMs: totalEnd,
  };
}
