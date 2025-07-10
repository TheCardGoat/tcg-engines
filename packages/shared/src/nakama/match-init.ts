/**
 * Types for Nakama match initialization and players
 */

/**
 * Basic presence interface for sharing between client and server
 * (simplified version of Nakama's presence)
 */
export interface Presence {
  userId: string;
  sessionId: string;
  username: string;
  node?: string;
}

/**
 * Player information passed when creating a match
 */
export type Player = {
  id: string;
  clerkId: number | string;
  deckId: number | string;
  deckVersionId: number | string;
  instantId: number | string;
  baseListHash: number | string;
  cardsHash: number | string;
  presence?: Presence;
};

/**
 * Parameters for initializing a regular match
 */
export type MatchInitParams = {
  instantId: string;
  queue: string;
  players: Player[];
  mode: "best-of-one" | "best-of-two" | "best-of-three";
};

/**
 * Parameters for initializing an event match (sealed format)
 */
export type EventMatchInitParams = {
  players: Player[];
  instantId: string;
  type: "sealed";
};

/**
 * Parameters for initializing a super sealed match
 */
export type SuperSealedMatchInitParams = {
  players: Player[];
  instantId: string;
  type: "super-sealed";
};
