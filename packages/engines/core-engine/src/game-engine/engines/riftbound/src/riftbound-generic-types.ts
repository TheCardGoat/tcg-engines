/**
 * Generic type definitions that extend the core engine for Riftbound TCG
 * These types integrate with the CoreEngine framework
 */

import type {
  CardInstanceState,
  CardRarity,
  CardType,
  CombatRole,
  Domain,
  GamePhase,
  GameSegment,
  MoveResult,
  PlayerState,
  ResourceType,
  RiftboundGameState,
  StatusCondition,
  ZoneType,
} from "./riftbound-engine-types";

// Re-export core types for convenience
export type {
  ZoneType,
  GamePhase,
  GameSegment,
  Domain,
  CardType,
  CardRarity,
  ResourceType,
  CombatRole,
  StatusCondition,
  CardInstanceState,
  MoveResult,
};

// Move types specific to Riftbound gameplay
export type RiftboundMoveType =
  // Setup and pregame moves
  | "chooseDomainIdentity"
  | "selectBattlefields"
  | "mulligan"
  | "chooseFirstPlayer"

  // Resource management moves
  | "channelRunes"
  | "activateRune"
  | "recycleCard"
  | "addResources"

  // Card play moves
  | "playCard"
  | "attachCard"
  | "activateAbility"
  | "activateKeyword"

  // Movement and positioning
  | "moveUnit"
  | "enterBattlefield"
  | "leaveBattlefield"

  // Combat moves
  | "declareCombat"
  | "declareDefenders"
  | "assignDamage"
  | "resolveCombat"

  // Showdown system
  | "enterShowdown"
  | "focusTarget"
  | "invitePlayer"

  // Scoring moves
  | "scoreConquer"
  | "scoreHold"

  // Utility moves
  | "drawCard"
  | "discardCard"
  | "revealCard"
  | "hideCard"
  | "killPermanent"
  | "banishCard"
  | "endTurn"
  | "passPriority"
  | "concede"
  | "cleanup"
  | "passToNextPlayer";

// Move parameter types for type safety
export interface RiftboundMoveParams {
  chooseDomainIdentity: { domains: Domain[] };
  selectBattlefields: { battlefieldIds: string[] };
  mulligan: { cardsToMulligan: string[] };
  chooseFirstPlayer: { playerId: string };

  channelRunes: { count: number; exhausted?: boolean };
  activateRune: { instanceId: string; ability?: string };
  recycleCard: { instanceIds: string[]; fromZone: ZoneType };
  addResources: { energy?: number; power?: Partial<Record<Domain, number>> };

  playCard: {
    instanceId: string;
    targets?: string[];
    additionalCosts?: any[];
    location?: string;
  };
  attachCard: { instanceId: string; targetId: string };
  activateAbility: {
    instanceId: string;
    abilityIndex: number;
    targets?: string[];
  };
  activateKeyword: { instanceId: string; keyword: string; targets?: string[] };

  moveUnit: { instanceIds: string[]; destination: string };
  enterBattlefield: { instanceId: string; battlefieldId: string };
  leaveBattlefield: { instanceId: string };

  declareCombat: {
    battlefieldId: string;
    attackers: string[];
    targets?: string[];
  };
  declareDefenders: { defenders: Record<string, string[]> };
  assignDamage: { assignments: Record<string, number> };
  resolveCombat: { battlefieldId: string };

  enterShowdown: { battlefieldId: string; relevantPlayers: string[] };
  focusTarget: { playerId: string };
  invitePlayer: { playerId: string };

  scoreConquer: { battlefieldId: string };
  scoreHold: { battlefieldId: string };

  drawCard: { count: number };
  discardCard: { instanceIds: string[] };
  revealCard: { instanceIds: string[]; fromZone: ZoneType };
  hideCard: { instanceId: string; battlefieldId: string };
  killPermanent: { instanceIds: string[] };
  banishCard: { instanceIds: string[]; fromZone: ZoneType };

  // Utility moves
  endTurn: {};
  passPriority: {};
  concede: {};
  cleanup: {};
  passToNextPlayer: {};
}

// Type for move functions in the engine
export type RiftboundMove<T extends RiftboundMoveType = RiftboundMoveType> = (
  params: T extends keyof RiftboundMoveParams ? RiftboundMoveParams[T] : any,
) => MoveResult | Promise<MoveResult>;

// Collection of all moves available in the engine
export type RiftboundMoves = {
  [K in RiftboundMoveType]: RiftboundMove<K>;
};

// Re-export main types from engine-types to avoid conflicts
export type { RiftboundGameState };
export type { PlayerState as RiftboundPlayerState };

// Additional type aliases for convenience
export type { RiftboundMoveType as MoveType };
export type { RiftboundMoveParams as MoveParams };
export type { RiftboundMoves as Moves };
