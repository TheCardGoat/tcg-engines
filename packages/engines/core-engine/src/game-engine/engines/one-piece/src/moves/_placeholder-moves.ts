import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * Placeholder implementations for remaining One Piece TCG moves
 * These will be implemented as needed
 */

export const startTurn: Move<OnePieceGameState> = ({ G }) => G;
export const endTurn: Move<OnePieceGameState> = ({ G }) => G;
export const passPriority: Move<OnePieceGameState> = ({ G }) => G;
export const giveDon: Move<OnePieceGameState> = ({ G }) => G;
export const returnDon: Move<OnePieceGameState> = ({ G }) => G;
export const playCharacter: Move<OnePieceGameState> = ({ G }) => G;
export const playStage: Move<OnePieceGameState> = ({ G }) => G;
export const activateEvent: Move<OnePieceGameState> = ({ G }) => G;
export const declareAttack: Move<OnePieceGameState> = ({ G }) => G;
export const declareBlock: Move<OnePieceGameState> = ({ G }) => G;
export const activateCounter: Move<OnePieceGameState> = ({ G }) => G;
export const resolveBattle: Move<OnePieceGameState> = ({ G }) => G;
export const activateEffect: Move<OnePieceGameState> = ({ G }) => G;
export const activateTrigger: Move<OnePieceGameState> = ({ G }) => G;
export const drawCard: Move<OnePieceGameState> = ({ G }) => G;
export const discardCard: Move<OnePieceGameState> = ({ G }) => G;
export const trashCard: Move<OnePieceGameState> = ({ G }) => G;
export const restCard: Move<OnePieceGameState> = ({ G }) => G;
export const setActive: Move<OnePieceGameState> = ({ G }) => G;
