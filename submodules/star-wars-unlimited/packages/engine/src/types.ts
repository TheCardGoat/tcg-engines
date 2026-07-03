import type {
  SwuCardDefinition,
  SwuChoice,
  SwuEffect,
  SwuTrigger,
  SwuZone,
} from "@tcg/star-wars-unlimited-types";

export type PlayerId = "player-one" | "player-two";

export interface RuntimeCard {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly owner: PlayerId;
  controller: PlayerId;
  zone: SwuZone;
  exhausted: boolean;
  playedThisPhase: boolean;
  damage: number;
  experience: number;
  shield: number;
  upgrades: string[];
  capturedCards: string[];
  temporaryPower: number;
  temporaryHp: number;
  keywords: string[];
  traits: string[];
}

export interface RuntimeEvent {
  readonly type: SwuTrigger["event"];
  readonly sourceId?: string;
  readonly attackerId?: string;
  readonly defenderId?: string;
  readonly defeatedId?: string;
}

export interface RuntimePlayer {
  readonly id: PlayerId;
  readonly name: string;
  baseId: string;
  leaderId: string;
  resources: number;
  readyResources: number;
  hasInitiative: boolean;
  passed: boolean;
  force: number;
  credits: number;
  advantage: number;
}

export interface PendingChoice {
  readonly id: string;
  readonly playerId: PlayerId;
  readonly sourceId: string;
  readonly prompt: string;
  readonly options: readonly SwuChoice[];
}

export interface MoveLogEntry {
  readonly sequence: number;
  readonly playerId?: PlayerId;
  readonly type: string;
  readonly message: string;
  readonly public: boolean;
}

export interface PhaseHistory {
  unitsDefeatedByController: Record<PlayerId, number>;
}

export interface MatchState {
  readonly id: string;
  readonly cards: Record<string, RuntimeCard>;
  readonly definitions: Record<string, SwuCardDefinition>;
  readonly players: Record<PlayerId, RuntimePlayer>;
  activePlayer: PlayerId;
  phase: "setup" | "action" | "regroup" | "complete";
  pendingChoices: PendingChoice[];
  delayedEffects: PendingChoice["options"][number][];
  moveLog: MoveLogEntry[];
  phaseHistory: PhaseHistory;
  nextInstanceNumber: number;
  nextChoiceNumber: number;
  nextLogNumber: number;
}

export type SwuCommand =
  | {
      readonly type: "activateAbility";
      readonly playerId: PlayerId;
      readonly sourceId: string;
      readonly abilityIndex: number;
    }
  | {
      readonly type: "attack";
      readonly playerId: PlayerId;
      readonly attackerId: string;
      readonly defenderId: string;
    }
  | { readonly type: "concede"; readonly playerId: PlayerId }
  | { readonly type: "mulligan"; readonly playerId: PlayerId }
  | { readonly type: "pass"; readonly playerId: PlayerId }
  | {
      readonly type: "playCard";
      readonly playerId: PlayerId;
      readonly cardId: string;
      readonly targetId?: string;
    }
  | {
      readonly type: "resolveChoice";
      readonly playerId: PlayerId;
      readonly choiceId: string;
      readonly optionId: string;
    };

export interface CommandResult {
  readonly success: boolean;
  readonly error?: string;
  readonly state: MatchState;
}
