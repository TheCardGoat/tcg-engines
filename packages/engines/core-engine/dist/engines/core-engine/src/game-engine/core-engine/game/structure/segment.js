import { processTurns, } from "~/game-engine/core-engine/game/structure/turn";
import { logger } from "~/game-engine/core-engine/utils/logger";
export function processSegments(segmentMap) {
    let startingSegment = null;
    const segmentMoveMap = {};
    const segmentMoveNames = new Set();
    for (const segment in segmentMap) {
        const segmentConfig = segmentMap[segment];
        if (segmentConfig.start === true) {
            if (startingSegment !== null) {
                logger.warn(`Multiple starting segments: ${startingSegment} and ${segment}`);
            }
            startingSegment = segment;
        }
        if (segmentConfig.endIf === undefined) {
            segmentConfig.endIf = () => undefined;
        }
        if (segmentConfig.onBegin === undefined) {
            segmentConfig.onBegin = ({ G }) => G;
        }
        if (segmentConfig.onEnd === undefined) {
            segmentConfig.onEnd = ({ G }) => G;
        }
        if (typeof segmentConfig.next !== "function") {
            const { next } = segmentConfig;
            segmentConfig.next = () => next || null;
        }
        if (segmentConfig.turn !== undefined) {
            const { turnMoveMap, turnMoveNames } = processTurns({
                turn: segmentConfig.turn,
            });
            for (const moveName of Object.keys(turnMoveMap)) {
                segmentMoveMap[`${segment}.${moveName}`] = turnMoveMap[moveName];
            }
            for (const moveName of turnMoveNames) {
                segmentMoveNames.add(moveName);
            }
        }
    }
    return { startingSegment, segmentMoveMap, segmentMoveNames };
}
//# sourceMappingURL=segment.js.map