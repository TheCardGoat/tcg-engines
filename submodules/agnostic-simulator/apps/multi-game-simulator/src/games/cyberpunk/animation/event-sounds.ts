import {
  PLAYER_SIDE_TO_ID,
  type AnimationStep,
  type GameEvent,
  type RawEngineEventEntry,
} from "../engine";
import type { SoundEffectId } from "./sound-service";

export interface ScheduledSound {
  id: SoundEffectId;
  startMs: number;
}

type StepKind = AnimationStep["kind"];

const FALLBACK_STAGGER_MS = 45;
export function scheduledSoundsForEntry(
  entry: RawEngineEventEntry,
  viewerPlayerId: string = PLAYER_SIDE_TO_ID.player,
): ScheduledSound[] {
  if (entry.events.length === 0) {
    return [];
  }
  const scheduled: ScheduledSound[] = [];
  const seen = new Set<SoundEffectId>();
  const seenGroups = new Set<string>();
  let fallbackIndex = 0;

  for (const event of entry.events) {
    const id = soundForEvent(event, viewerPlayerId);
    if (!id) {
      continue;
    }
    const group = dedupeGroup(id);
    if (seen.has(id) || (group && seenGroups.has(group))) {
      continue;
    }
    seen.add(id);
    if (group) {
      seenGroups.add(group);
    }
    scheduled.push({
      id,
      startMs: startMsForEvent(entry, event) ?? fallbackIndex++ * FALLBACK_STAGGER_MS,
    });
  }

  return scheduled.sort((a, b) => a.startMs - b.startMs);
}

function dedupeGroup(id: SoundEffectId): string | null {
  switch (id) {
    case "attack-hit":
    case "block":
    case "defeat":
      return "combat-result";
    case "victory":
    case "defeat-game":
      return "game-result";
    default:
      return null;
  }
}

function soundForEvent(event: GameEvent, viewerPlayerId: string): SoundEffectId | null {
  switch (event.type) {
    case "cardPlayed":
      return "card-play";
    case "cardsDrawn":
      return "card-draw";
    case "cardMoved":
      return event.toZone === "trash" ? "card-trash" : "card-move";
    case "cardAttached":
    case "cardDetached":
      return "card-move";
    case "cardDefeated":
      return "defeat";
    case "cardSpent":
    case "eddiesSpent":
      return "resource-spend";
    case "eddiesGained":
      return "resource-gain";
    case "gigDieRolled":
      return "gig-roll";
    case "gigDieMoved":
      return "gig-move";
    case "gigStolen":
      return "gig-steal";
    case "gigValueChanged":
      return "gig-change";
    case "attackDeclared":
      return "attack-start";
    case "attackResolved":
      return event.result === "blocked" ? "block" : "attack-hit";
    case "blockerActivated":
      return "block";
    case "effectTriggered":
      return "effect-trigger";
    case "effectTargeted":
      return "effect-target";
    case "phaseChanged":
      return "phase-change";
    case "turnStarted":
      return "turn-change";
    case "gameEnded":
      return event.winnerId === viewerPlayerId ? "victory" : "defeat-game";
    default:
      return null;
  }
}

function startMsForEvent(entry: RawEngineEventEntry, event: GameEvent): number | null {
  const steps = entry.animationScript.steps;
  switch (event.type) {
    case "cardPlayed":
      return findStepStart(steps, ["cardEnter", "cardLand", "cardAttach", "cardMove"]);
    case "cardsDrawn":
      return findCardStepStart(steps, event.cardIds[0] ?? null);
    case "cardMoved":
      return findCardStepStart(steps, event.cardId);
    case "cardAttached":
      return findStepStart(
        steps.filter((step) => step.kind !== "cardAttach" || step.gearId === event.gearId),
        ["cardAttach"],
      );
    case "cardDetached":
      return findCardStepStart(steps, event.gearId);
    case "cardDefeated":
      return findCardStepStart(steps, event.cardId);
    case "cardSpent":
    case "eddiesSpent":
    case "eddiesGained":
      return findStepStart(steps, ["resourceFloat"]);
    case "gigDieRolled":
    case "gigDieMoved":
    case "gigStolen":
    case "gigValueChanged":
      return findGigStepStart(steps, event.dieId);
    case "attackDeclared":
    case "attackResolved":
    case "blockerActivated":
      return findStepStart(steps, ["combat"]);
    case "effectTriggered":
      return findStepStart(steps, ["effectTarget", "resourceFloat"]);
    case "effectTargeted":
      return findStepStart(
        steps.filter(
          (step) => step.kind !== "effectTarget" || step.sourceCardId === event.sourceCardId,
        ),
        ["effectTarget"],
      );
    case "phaseChanged":
      return findStepStart(steps, ["phaseChange"]);
    case "turnStarted":
    case "gameEnded":
      return null;
    default:
      return null;
  }
}

function findStepStart(steps: readonly AnimationStep[], kinds: readonly StepKind[]): number | null {
  const found = steps
    .filter((step) => kinds.includes(step.kind))
    .sort((a, b) => a.startMs - b.startMs)[0];
  return found?.startMs ?? null;
}

function findCardStepStart(steps: readonly AnimationStep[], cardId: unknown): number | null {
  if (!cardId) {
    return findStepStart(steps, ["cardMove", "cardExit", "cardEnter", "cardAttach", "cardLand"]);
  }
  const found = steps
    .filter((step) => {
      switch (step.kind) {
        case "cardMove":
        case "cardExit":
        case "cardEnter":
        case "cardLand":
          return step.cardId === cardId;
        case "cardAttach":
          return step.gearId === cardId || step.hostId === cardId;
        default:
          return false;
      }
    })
    .sort((a, b) => a.startMs - b.startMs)[0];
  return found?.startMs ?? null;
}

function findGigStepStart(steps: readonly AnimationStep[], dieId: unknown): number | null {
  const found = steps
    .filter((step) => step.kind === "gigMove" && step.dieId === dieId)
    .sort((a, b) => a.startMs - b.startMs)[0];
  return found?.startMs ?? null;
}
