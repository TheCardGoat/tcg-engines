import type {
  CardZone,
  EngineAnimation,
  EngineCommand,
  EngineEvent,
  MatchSeat,
  MatchState,
} from "./types.ts";

const CARD_MOVE_DURATION_MS = 420;
const ATTACK_DURATION_MS = 520;
const EFFECT_DURATION_MS = 500;

export interface BuildOnePieceAnimationsInput {
  readonly command: EngineCommand;
  readonly fromState: MatchState;
  readonly toState: MatchState;
  readonly events: readonly EngineEvent[];
}

export function buildOnePieceAnimations({
  command,
  fromState,
  toState,
  events,
}: BuildOnePieceAnimationsInput): EngineAnimation[] {
  const animations: EngineAnimation[] = [];

  for (const event of events) {
    switch (event.type) {
      case "cardMoved": {
        const cardId = event.sourceInstanceId;
        const fromCard = cardId ? fromState.cards[cardId] : undefined;
        const toCard = cardId ? toState.cards[cardId] : undefined;
        const fromZone = cardZone(event.payload.fromZone) ?? fromCard?.zone;
        const toZone = cardZone(event.payload.toZone) ?? toCard?.zone;
        const fromOwner = matchSeat(event.payload.fromOwner) ?? fromCard?.owner;
        const toOwner = matchSeat(event.payload.toOwner) ?? toCard?.owner;
        if (!cardId || !fromZone || !toZone || !fromOwner || !toOwner) {
          break;
        }
        animations.push({
          id: `${event.id}:card-move:${cardId}`,
          type: "cardMove",
          duration: CARD_MOVE_DURATION_MS,
          data: {
            kind: "cardMove",
            cardId,
            fromZone,
            toZone,
            fromOwner,
            toOwner,
          },
        });
        break;
      }
      case "attackDeclared": {
        const attackerId = event.sourceInstanceId;
        const targetId = event.targetIds[0];
        if (!attackerId || !targetId) {
          break;
        }
        animations.push({
          id: `${event.id}:attack:${attackerId}:${targetId}`,
          type: "attack",
          duration: ATTACK_DURATION_MS,
          data: {
            kind: "attack",
            attackerId,
            targetId,
          },
        });
        break;
      }
      case "effectResolved": {
        const sourceInstanceId = event.sourceInstanceId;
        if (!sourceInstanceId) {
          break;
        }
        animations.push({
          id: `${event.id}:effect:${sourceInstanceId}`,
          type: "effect",
          duration: EFFECT_DURATION_MS,
          data: {
            kind: "effect",
            sourceInstanceId,
            targetIds: event.targetIds,
            label: "RESOLVED",
          },
        });
        break;
      }
      default:
        break;
    }
  }

  if (animations.length === 0 && command.type === "attachDon") {
    animations.push({
      id: `command:${toState.eventSequence}:attach-don:${command.targetId}`,
      type: "generic",
      duration: EFFECT_DURATION_MS,
      data: {
        kind: "generic",
        name: "donAttached",
        params: {
          targetId: command.targetId,
          amount: command.amount ?? 1,
        },
      },
    });
  }

  return animations;
}

function cardZone(value: unknown): CardZone | undefined {
  switch (value) {
    case "leader":
    case "deck":
    case "hand":
    case "life":
    case "character":
    case "stage":
    case "trash":
      return value;
    default:
      return undefined;
  }
}

function matchSeat(value: unknown): MatchSeat | undefined {
  switch (value) {
    case "north":
    case "south":
      return value;
    default:
      return undefined;
  }
}
