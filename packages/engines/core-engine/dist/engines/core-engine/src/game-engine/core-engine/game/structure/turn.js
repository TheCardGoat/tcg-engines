import { processPhases, } from "~/game-engine/core-engine/game/structure/phase";
export function processTurns(turnsMap) {
    const turnMoveMap = {};
    const turnMoveNames = new Set();
    for (const turn in turnsMap) {
        const turnConfig = turnsMap[turn];
        if (turnConfig.endIf === undefined) {
            turnConfig.endIf = () => undefined;
        }
        if (turnConfig.onBegin === undefined) {
            turnConfig.onBegin = ({ G }) => G;
        }
        if (turnConfig.onEnd === undefined) {
            turnConfig.onEnd = ({ G }) => G;
        }
        if (turnConfig.moves !== undefined) {
            for (const move of Object.keys(turnConfig.moves)) {
                turnMoveMap[move] = turnConfig.moves[move];
                turnMoveNames.add(move);
            }
        }
        if (turnConfig.phases !== undefined) {
            const { phaseMoveMap, phaseMoveNames } = processPhases(turnConfig.phases);
            for (const moveName of Object.keys(phaseMoveMap)) {
                turnMoveMap[moveName] = phaseMoveMap[moveName];
            }
            for (const moveName of phaseMoveNames) {
                turnMoveNames.add(moveName);
            }
        }
    }
    return { turnMoveMap, turnMoveNames };
}
//# sourceMappingURL=turn.js.map