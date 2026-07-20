import type { PacketAnimation } from "../types/animation.ts";
import type { CtxStatus } from "../types/match-state.ts";
import type { GundamMoveLog } from "../types/move-log.ts";

const CARD_MOVE_DURATION_MS = 420;
const DAMAGE_DURATION_MS = 360;
const GENERIC_DURATION_MS = 320;

export interface BuildPacketAnimationsInput {
  readonly moveLogs: readonly GundamMoveLog[];
  readonly previousStatus: Readonly<CtxStatus>;
  readonly nextStatus: Readonly<CtxStatus>;
  readonly ownerIdForCard?: (cardId: string) => string | undefined;
}

export function buildPacketAnimations({
  moveLogs,
  previousStatus,
  nextStatus,
  ownerIdForCard,
}: BuildPacketAnimationsInput): PacketAnimation[] {
  const animations: PacketAnimation[] = [];

  for (const log of moveLogs) {
    const prefix = log.commandID ?? `${log.timestamp}:${log.type}`;

    switch (log.type) {
      case "deployUnit":
        animations.push(
          cardMove(`${prefix}:deploy-unit`, log.cardId, log.playerId, "hand", "battleArea"),
        );
        break;
      case "deployBase":
        animations.push(
          cardMove(`${prefix}:deploy-base`, log.cardId, log.playerId, "hand", "baseSection"),
        );
        break;
      case "playCommand": {
        animations.push(
          generic(`${prefix}:play-command`, "commandPlayed", {
            cardId: String(log.cardId),
            ownerId: String(log.playerId),
            awaitsResolution: commandAwaitsManualResolution(log),
          }),
        );
        break;
      }
      case "assignPilot":
        animations.push(
          cardMove(`${prefix}:assign-pilot`, log.pilotId, log.playerId, "hand", "battleArea"),
        );
        break;
      case "attack":
        animations.push(
          generic(`${prefix}:attack`, "attackDeclared", {
            attackerId: String(log.attackerId),
            targetId: String(log.targetId),
            playerId: String(log.playerId),
          }),
        );
        break;
      case "block":
        animations.push(
          generic(`${prefix}:block`, "blockDeclared", {
            blockerId: String(log.blockerId),
            attackerId: String(log.attackerId),
            playerId: String(log.playerId),
          }),
        );
        break;
      case "resolveEffect":
        animations.push(
          generic(`${prefix}:resolve-effect`, "effectResolved", {
            sourceCardId: String(log.sourceCardId),
            targets: log.resolution?.targets?.map(String) ?? [],
            playerId: String(log.playerId),
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
          log.playerId,
          moved.from,
          moved.to,
        ),
      );
    }

    for (const cardId of log.outcomes?.cardsReturnedToHand ?? []) {
      animations.push(
        cardMove(
          `${prefix}:return:${cardId}`,
          cardId,
          ownerIdForCard?.(String(cardId)) ?? log.playerId,
          undefined,
          "hand",
        ),
      );
    }

    for (const cardId of log.outcomes?.cardsDiscarded ?? []) {
      animations.push(
        cardMove(`${prefix}:discard:${cardId}`, cardId, log.playerId, undefined, "trash"),
      );
    }

    for (const defeated of log.outcomes?.unitsDefeated ?? []) {
      animations.push(
        cardMove(
          `${prefix}:defeated:${defeated.cardId}`,
          defeated.cardId,
          defeated.ownerId,
          undefined,
          "trash",
        ),
      );
    }

    for (const shield of log.outcomes?.shieldsRemoved ?? []) {
      animations.push(
        cardMove(
          `${prefix}:shield:${shield.cardId}`,
          shield.cardId,
          shield.playerId,
          "shieldArea",
          "trash",
        ),
      );
    }

    for (const placed of log.outcomes?.resourcesPlaced ?? []) {
      animations.push(
        cardMove(
          `${prefix}:resource:${placed.cardId}`,
          placed.cardId,
          placed.playerId,
          undefined,
          "resourceArea",
        ),
      );
    }

    const draw = log.outcomes?.cardsDrawn;
    if (draw) {
      const cardIds = privateValue(draw.cardIds) ?? [];
      for (let index = 0; index < draw.count; index += 1) {
        const cardId = cardIds[index] ?? `__hidden_draw_${prefix}_${index}`;
        animations.push(
          cardMove(
            `${prefix}:draw:${index}`,
            cardId,
            draw.playerId ?? log.playerId,
            "deck",
            "hand",
          ),
        );
      }
    }

    for (const damage of log.outcomes?.damageDealt ?? []) {
      animations.push({
        id: `${prefix}:damage:${damage.targetId}:${animations.length}`,
        type: "damage",
        duration: DAMAGE_DURATION_MS,
        data: {
          kind: "damage",
          sourceId:
            damage.sourceCardId ??
            (log.type === "attack"
              ? String(log.attackerId)
              : log.type === "block"
                ? String(log.blockerId)
                : undefined),
          targetId: String(damage.targetId),
          amount: damage.amount,
          damageType: "battle",
        },
      });
    }

    const spent = log.outcomes?.resourcesSpent;
    if (spent && (spent.regularCount > 0 || spent.exRemovedCount > 0)) {
      animations.push(
        generic(`${prefix}:resources-spent`, "resourcesSpent", {
          playerId: String(log.playerId),
          amount: spent.regularCount + spent.exRemovedCount,
        }),
      );
    }

    for (const cardId of new Set([
      ...(log.outcomes?.unitsRested ?? []),
      ...(log.outcomes?.cardsExhausted ?? []),
    ])) {
      animations.push(
        generic(`${prefix}:rested:${cardId}`, "cardStateChanged", {
          cardId: String(cardId),
          state: "rested",
        }),
      );
    }

    for (const cardId of new Set(log.outcomes?.cardsReadied ?? [])) {
      animations.push(
        generic(`${prefix}:ready:${cardId}`, "cardStateChanged", {
          cardId: String(cardId),
          state: "ready",
        }),
      );
    }
  }

  if (
    previousStatus.turn !== nextStatus.turn ||
    previousStatus.turnPlayer !== nextStatus.turnPlayer
  ) {
    animations.push(
      generic(`turn:${nextStatus.turn}:${String(nextStatus.turnPlayer)}`, "turnChanged", {
        previousTurn: previousStatus.turn,
        turn: nextStatus.turn,
        playerId: String(nextStatus.turnPlayer ?? nextStatus.activePlayer),
      }),
    );
  }

  const previousPhase = statusLabel(previousStatus);
  const nextPhase = statusLabel(nextStatus);
  if (previousPhase !== nextPhase) {
    animations.push(
      generic(
        `phase:${nextStatus.turn}:${nextStatus.gameSegment ?? ""}:${nextStatus.phase ?? ""}:${nextStatus.step ?? ""}`,
        "phaseChanged",
        { from: previousPhase, to: nextPhase },
      ),
    );
  }

  return dedupeAnimations(animations);
}

function dedupeAnimations(animations: readonly PacketAnimation[]): PacketAnimation[] {
  const seenCardMoves = new Set<string>();
  return animations.filter((animation) => {
    if (animation.data.kind !== "cardMove") return true;
    const key = [animation.data.cardId, animation.data.fromZone, animation.data.toZone].join(":");
    if (seenCardMoves.has(key)) return false;
    seenCardMoves.add(key);
    return true;
  });
}

function cardMove(
  id: string,
  cardId: unknown,
  ownerId: unknown,
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
      ownerId: String(ownerId),
      fromZone: fromZone ?? "",
      toZone,
    },
  };
}

function commandAwaitsManualResolution(
  log: Extract<GundamMoveLog, { type: "playCommand" }>,
): boolean {
  const cardId = String(log.cardId);
  const resolvedEffectIds = new Set(
    (log.outcomes?.effectsResolved ?? [])
      .filter((effect) => String(effect.sourceCardId) === cardId)
      .map((effect) => effect.effectId),
  );
  return (log.outcomes?.effectsQueued ?? []).some(
    (effect) => String(effect.sourceCardId) === cardId && !resolvedEffectIds.has(effect.effectId),
  );
}

function statusLabel(status: Readonly<CtxStatus>): string {
  return [status.gameSegment, status.phase, status.step].filter(Boolean).join(" / ");
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
