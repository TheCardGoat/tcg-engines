import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import { LinearCongruentialGenerator, shuffleCardZone, } from "~/game-engine/core-engine/utils/random";
/**
 * Type guard to check if a result is a zone operation error
 */
export function isZoneOperationError(result) {
    return (typeof result === "object" &&
        result !== null &&
        "type" in result &&
        result.type === "ZONE_OPERATION_ERROR");
}
export function getCardZone(ctx, zoneId, playerId) {
    return (ctx.cardZones[zoneId] ||
        Object.values(ctx.cardZones).find((cardZone) => cardZone.owner === playerId && cardZone.name === zoneId));
}
export function getCardZoneByInstanceId(ctx, instanceId) {
    return Object.values(ctx.cardZones).find((zone) => zone.cards.includes(instanceId));
}
function moveCardBetweenZones({ ctx, playerId, fromZone, toZone, cardToMove, destination, }) {
    if (!(fromZone && toZone)) {
        logger.warn(`One of the zones ('${fromZone?.name}' or '${toZone?.name}') not found in context.`);
        return ctx;
    }
    if (fromZone.owner !== playerId || toZone.owner !== playerId) {
        logger.warn(`Player ${playerId} does not own one of the zones ('${fromZone.id}' or '${toZone.id}').`);
        return ctx;
    }
    if (!fromZone.cards.includes(cardToMove)) {
        logger.warn(`Card ${cardToMove} not found in zone: '${fromZone.id}'.`);
        return ctx;
    }
    const newFromCards = fromZone.cards.filter((id) => id !== cardToMove);
    const newToCards = [...toZone.cards];
    if (destination === "start") {
        newToCards.unshift(cardToMove);
    }
    else {
        newToCards.push(cardToMove);
    }
    // Sanity check: Card counts should not change during a move
    if (newFromCards.length + newToCards.length !==
        fromZone.cards.length + toZone.cards.length) {
        logger.error(`Card count mismatch after move: fromZone=${fromZone.cards.length}, toZone=${toZone.cards.length}, movedCard=${cardToMove}`);
        return ctx;
    }
    if (debuggers.zoneOperations) {
        logger.debug(`Moving card '${cardToMove}' from zone '${fromZone.id}' to zone '${toZone.id}'`);
    }
    return {
        ...ctx,
        cardZones: {
            ...ctx.cardZones,
            [fromZone.id]: {
                ...fromZone,
                cards: newFromCards,
            },
            [toZone.id]: {
                ...toZone,
                cards: newToCards,
            },
        },
    };
}
export function shuffleZone(ctx, zoneId) {
    const zone = getCardZone(ctx, zoneId);
    if (!zone) {
        logger.warn(`[shuffeZone] Zone ${zoneId} not found in context.`);
        return ctx;
    }
    const lcg = new LinearCongruentialGenerator(ctx.seed);
    const next = lcg.next();
    return {
        ...ctx,
        seed: next,
        cardZones: {
            ...ctx.cardZones,
            [zoneId]: {
                ...ctx.cardZones[zoneId],
                cards: shuffleCardZone(ctx.cardZones[zoneId].cards, lcg.seed),
            },
        },
    };
}
export function moveCardByInstanceId({ ctx, instanceId, playerId, to, from, destination = "end", }) {
    const fromZone = getCardZoneByInstanceId(ctx, instanceId);
    const toZone = getCardZone(ctx, to, playerId);
    // Validate from constraint if provided
    if (from && fromZone) {
        const zoneMatches = fromZone.id === from || fromZone.name === from;
        const ownershipMatches = fromZone.owner === playerId;
        if (!(zoneMatches && ownershipMatches)) {
            return {
                type: "ZONE_OPERATION_ERROR",
                reason: "CARD_NOT_IN_EXPECTED_ZONE",
                context: {
                    instanceId,
                    expectedZone: from,
                    actualZone: fromZone.id || fromZone.name,
                    actualOwner: fromZone.owner,
                    expectedOwner: playerId,
                    playerId,
                },
            };
        }
    }
    // Handle case where card doesn't exist but from constraint is provided
    if (from && !fromZone) {
        return {
            type: "ZONE_OPERATION_ERROR",
            reason: "CARD_NOT_IN_EXPECTED_ZONE",
            context: {
                instanceId,
                expectedZone: from,
                actualZone: undefined,
                playerId,
            },
        };
    }
    if (!(fromZone && toZone)) {
        return {
            type: "ZONE_OPERATION_ERROR",
            reason: "ZONE_NOT_FOUND",
            context: {
                fromZone: fromZone?.name,
                toZone: to,
                instanceId,
                playerId,
            },
        };
    }
    return moveCardBetweenZones({
        ctx,
        playerId,
        fromZone,
        toZone,
        cardToMove: instanceId,
        origin: "start", // not used in this context
        destination,
    });
}
export function move({ ctx, playerId, from, to, origin = "start", destination = "end", }) {
    const fromZone = getCardZone(ctx, from, playerId);
    const toZone = getCardZone(ctx, to, playerId);
    if (!(fromZone && toZone)) {
        logger.warn(`One of the zones ('${from}' or '${to}') not found in context.`);
        return ctx;
    }
    if (fromZone.cards.length === 0) {
        logger.warn(`Cannot move card from empty zone: '${fromZone.id}'.`);
        return ctx;
    }
    const cardToMove = origin === "start"
        ? fromZone.cards[0]
        : fromZone.cards[fromZone.cards.length - 1];
    if (!cardToMove) {
        return ctx;
    }
    return moveCardBetweenZones({
        ctx,
        playerId,
        fromZone,
        toZone,
        cardToMove,
        origin,
        destination,
    });
}
//# sourceMappingURL=zone-operation.js.map