import type { PacketAnimation } from "../types/animation.ts";
import type { GundamMoveLog } from "../types/move-log.ts";

const CARD_MOVE_DURATION_MS = 420;
const DAMAGE_DURATION_MS = 360;
const GENERIC_DURATION_MS = 320;

export interface BuildPacketAnimationsInput {
  readonly moveLogs: readonly GundamMoveLog[];
}

export function buildPacketAnimations({ moveLogs }: BuildPacketAnimationsInput): PacketAnimation[] {
  const animations: PacketAnimation[] = [];

  for (const log of moveLogs) {
    const prefix = log.commandID ?? `${log.timestamp}:${log.type}`;

    switch (log.type) {
      case "deployUnit":
        animations.push(cardMove(`${prefix}:deploy-unit`, log.cardId, "hand", "battleArea"));
        break;
      case "deployBase":
        animations.push(cardMove(`${prefix}:deploy-base`, log.cardId, "hand", "baseSection"));
        break;
      case "playCommand":
        animations.push(cardMove(`${prefix}:play-command`, log.cardId, "hand", "removalArea"));
        break;
      case "assignPilot":
        animations.push(cardMove(`${prefix}:assign-pilot`, log.pilotId, "hand", "battleArea"));
        break;
      case "attack":
        animations.push(
          generic(`${prefix}:attack`, "attackDeclared", {
            attackerId: String(log.attackerId),
            targetId: String(log.targetId),
          }),
        );
        break;
      case "block":
        animations.push(
          generic(`${prefix}:block`, "blockDeclared", {
            blockerId: String(log.blockerId),
            attackerId: String(log.attackerId),
          }),
        );
        break;
      case "resolveEffect":
        animations.push(
          generic(`${prefix}:resolve-effect`, "effectResolved", {
            sourceCardId: String(log.sourceCardId),
            targets: log.resolution?.targets?.map(String) ?? [],
          }),
        );
        break;
      case "pass":
      case "turnStart":
      case "gameEnd":
        break;
    }

    for (const moved of log.outcomes?.cardsMoved ?? []) {
      animations.push(
        cardMove(
          `${prefix}:move:${moved.cardId}:${animations.length}`,
          moved.cardId,
          moved.from,
          moved.to,
        ),
      );
    }

    for (const cardId of log.outcomes?.cardsReturnedToHand ?? []) {
      animations.push(cardMove(`${prefix}:return:${cardId}`, cardId, undefined, "hand"));
    }

    for (const cardId of log.outcomes?.cardsDiscarded ?? []) {
      animations.push(cardMove(`${prefix}:discard:${cardId}`, cardId, undefined, "trash"));
    }

    for (const defeated of log.outcomes?.unitsDefeated ?? []) {
      animations.push(
        cardMove(`${prefix}:defeated:${defeated.cardId}`, defeated.cardId, undefined, "trash"),
      );
    }

    for (const shield of log.outcomes?.shieldsRemoved ?? []) {
      animations.push(
        cardMove(`${prefix}:shield:${shield.cardId}`, shield.cardId, "shieldArea", "hand"),
      );
    }

    for (const placed of log.outcomes?.resourcesPlaced ?? []) {
      animations.push(
        cardMove(`${prefix}:resource:${placed.cardId}`, placed.cardId, undefined, "resourceArea"),
      );
    }

    const draw = log.outcomes?.cardsDrawn;
    if (draw) {
      const cardIds = privateValue(draw.cardIds) ?? [];
      for (let index = 0; index < draw.count; index += 1) {
        const cardId = cardIds[index] ?? `__hidden_draw_${prefix}_${index}`;
        animations.push(cardMove(`${prefix}:draw:${index}`, cardId, "deck", "hand"));
      }
    }

    for (const damage of log.outcomes?.damageDealt ?? []) {
      animations.push({
        id: `${prefix}:damage:${damage.targetId}:${animations.length}`,
        type: "damage",
        duration: DAMAGE_DURATION_MS,
        data: {
          kind: "damage",
          targetId: String(damage.targetId),
          amount: damage.amount,
          damageType: "battle",
        },
      });
    }
  }

  return animations;
}

function cardMove(
  id: string,
  cardId: unknown,
  fromZone: string | undefined,
  toZone: string,
): PacketAnimation {
  return {
    id,
    type: "cardMove",
    duration: CARD_MOVE_DURATION_MS,
    data: {
      kind: "cardMove",
      cardId: String(cardId),
      fromZone: fromZone ?? "",
      toZone,
    },
  };
}

function generic(id: string, name: string, params: Record<string, unknown>): PacketAnimation {
  return {
    id,
    type: "generic",
    duration: GENERIC_DURATION_MS,
    data: {
      kind: "generic",
      name,
      params,
    },
  };
}

function privateValue<T>(value: { readonly value: T } | T | undefined): T | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && value !== null && "value" in value) {
    return value.value;
  }
  return value as T;
}
