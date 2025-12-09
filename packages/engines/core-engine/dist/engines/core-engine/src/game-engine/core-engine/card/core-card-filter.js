import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import { logger } from "~/game-engine/core-engine/utils/logger";
export function getCardsByFilter({ state, store, filter, }) {
    const { zone, owner, publicId, instanceId } = filter;
    const cards = store.getAllCards();
    const result = cards.filter((card) => {
        if (publicId && card.publicId !== publicId) {
            return false;
        }
        if (instanceId && card.instanceId !== instanceId) {
            return false;
        }
        if (owner && card.owner !== owner) {
            return false;
        }
        if (zone) {
            const cardZone = getCardZone(state.ctx, zone, card.owner);
            if (!cardZone) {
                logger.error(`Card ${card.instanceId} is not in zone ${zone}: Zone does not exist.`);
                return false;
            }
            if (!cardZone.cards.find((zoneCard) => zoneCard === card.instanceId)) {
                return false;
            }
        }
        return true;
    });
    return result;
}
//# sourceMappingURL=core-card-filter.js.map