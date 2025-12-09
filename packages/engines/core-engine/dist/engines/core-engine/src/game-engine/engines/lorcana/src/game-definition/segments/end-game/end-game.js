import { logger } from "~/game-engine/core-engine/utils/logger";
export const endGameSegment = {
    end: true,
    onBegin: ({ G }) => {
        logger.debug("End Game Segment: onBegin called");
        return G;
    },
    turn: {},
};
//# sourceMappingURL=end-game.js.map