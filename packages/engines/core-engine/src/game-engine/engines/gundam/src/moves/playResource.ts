import type { GundamMove } from "./types";

/**
 * Play Resource Move - Implementation of Rule 6-4-1
 * The active player places one Resource card from their Resource deck to the Resource area.
 * Resource cards are placed face up and active (ready state).
 * Maximum of 15 resources allowed in Resource area, maximum of 5 EX Resources.
 */
export const playResourceMove: GundamMove = ({ G, coreOps, playerID }) => {
  return G;
};
