import type { CardInstanceId, PlayerId } from "./branded.ts";
import type { PrivateField } from "../runtime/private-field.ts";

export interface GundamMoveLogBase {
  readonly type: GundamMoveLog["type"];
  readonly playerId: PlayerId;
  readonly timestamp: number;
  readonly stateID?: number;
  readonly turnNumber?: number;
  readonly commandID?: string;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface GundamMoveOutcomes {
  readonly resourcesSpent?: { readonly regularCount: number; readonly exRemovedCount: number };
  readonly cardsDiscarded?: readonly CardInstanceId[];
  readonly unitsRested?: readonly CardInstanceId[];
  readonly damageDealt?: readonly {
    readonly sourceCardId?: CardInstanceId;
    readonly targetId: CardInstanceId;
    readonly amount: number;
  }[];
  readonly shieldsRemoved?: readonly {
    readonly cardId: CardInstanceId;
    readonly playerId: PlayerId;
    readonly sourceCardId?: CardInstanceId;
  }[];
  readonly unitsDefeated?: readonly {
    readonly cardId: CardInstanceId;
    readonly ownerId: PlayerId;
    readonly defeatedBy?: CardInstanceId;
  }[];
  readonly cardsDrawn?: {
    readonly count: number;
    readonly playerId?: PlayerId;
    readonly cardIds?: PrivateField<CardInstanceId[]>;
  };
  readonly cardsMoved?: readonly {
    readonly cardId: CardInstanceId;
    readonly from?: string;
    readonly to: string;
  }[];
  readonly cardsReturnedToHand?: readonly CardInstanceId[];
  readonly cardsReadied?: readonly CardInstanceId[];
  readonly cardsExhausted?: readonly CardInstanceId[];
  readonly resourcesPlaced?: readonly {
    readonly playerId: PlayerId;
    readonly cardId: CardInstanceId;
    readonly state: "active" | "rested";
  }[];
  readonly effectsQueued?: readonly {
    readonly effectId: string;
    readonly sourceCardId: CardInstanceId;
    readonly controllerId: PlayerId;
    readonly kind: string;
  }[];
  readonly effectsResolved?: readonly {
    readonly effectId: string;
    readonly sourceCardId: CardInstanceId;
  }[];
}

export interface DeployUnitLog extends GundamMoveLogBase {
  readonly type: "deployUnit";
  readonly cardId: CardInstanceId;
  readonly cost: number;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface DeployBaseLog extends GundamMoveLogBase {
  readonly type: "deployBase";
  readonly cardId: CardInstanceId;
  readonly cost: number;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface PlayCommandLog extends GundamMoveLogBase {
  readonly type: "playCommand";
  readonly cardId: CardInstanceId;
  readonly cost: number;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface AssignPilotLog extends GundamMoveLogBase {
  readonly type: "assignPilot";
  readonly pilotId: CardInstanceId;
  readonly unitId: CardInstanceId;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface AttackLog extends GundamMoveLogBase {
  readonly type: "attack";
  readonly attackerId: CardInstanceId;
  readonly targetId: CardInstanceId | "direct";
  readonly blockerId?: CardInstanceId;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface BlockLog extends GundamMoveLogBase {
  readonly type: "block";
  readonly blockerId: CardInstanceId;
  readonly attackerId: CardInstanceId;
  readonly outcomes?: GundamMoveOutcomes;
}

export interface ResolveEffectLog extends GundamMoveLogBase {
  readonly type: "resolveEffect";
  readonly sourceCardId: CardInstanceId;
  readonly effectId?: string;
  readonly effectIndex?: number;
  readonly resolution?: {
    readonly kind: "targetSelection" | "choiceSelection" | "optionalSelection" | "automatic";
    readonly targets?: readonly (CardInstanceId | PlayerId)[];
    readonly choiceIndex?: number;
    readonly accepted?: boolean;
  };
  readonly outcomes?: GundamMoveOutcomes;
}

export interface PassLog extends GundamMoveLogBase {
  readonly type: "pass";
  readonly context: "action-step" | "block" | "battle" | "turn";
}

export interface TurnStartLog extends GundamMoveLogBase {
  readonly type: "turnStart";
  readonly turnNumber: number;
  readonly activePlayerId: PlayerId;
  readonly drawn?: PrivateField<CardInstanceId[]>;
}

export interface GameEndLog extends GundamMoveLogBase {
  readonly type: "gameEnd";
  readonly winnerId?: PlayerId;
  readonly reason: string;
}

export type GundamMoveLog =
  | DeployUnitLog
  | DeployBaseLog
  | PlayCommandLog
  | AssignPilotLog
  | AttackLog
  | BlockLog
  | ResolveEffectLog
  | PassLog
  | TurnStartLog
  | GameEndLog;
