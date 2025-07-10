import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { GundamGameState } from "../gundam-engine-types";
import type { gundamMoves } from "./moves";

export type GundamMove = Move<GundamGameState>;
export type ValidMoves = keyof typeof gundamMoves;
