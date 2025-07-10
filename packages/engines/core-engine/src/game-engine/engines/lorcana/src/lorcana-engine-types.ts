import type { LorcanitoCard } from "@lorcanito/lorcana-engine";

export type LorcanaCardDefinition = LorcanitoCard;

export type LorcanaGameState = {
  effects: LayerItem[];
  bag: LayerItem[];
  turnActions?: {
    putCardIntoInkwell?: boolean;
    // Add other turn-limited actions as needed
  };
};

export type Zone = "deck" | "hand" | "play" | "inkwell" | "discard" | "bag";

export type LayerItem = {
  id: string;
  sourceCardId: string;
  controllerId: string;
  ability: Ability;
  targets: Target[];
  timestamp: number;
  optional: boolean;
};

export type Ability = {
  id: string;
  type: "activated" | "triggered" | "static" | "keyword";
  text: string;
  cost?: AbilityCost;
  effect: Effect;
  timing?: TriggerTiming;
};

export type Duration =
  | { type: "endOfTurn" }
  | { type: "untilLeaves" }
  | { type: "turns"; count: number }
  | { type: "permanent" };

export type AbilityCost = {
  exert?: boolean;
  ink?: number;
  banish?: boolean;
  discard?: number;
  damage?: number;
};

export type Effect = {
  type: string;
  parameters: Record<string, any>;
};

export type Target = {
  type: "card" | "player";
  id: string;
};

export type TriggerTiming =
  | "onPlay"
  | "onQuest"
  | "onPutIntoInkwell"
  | "onChallenge"
  | "onBanish"
  | "onDamage"
  | "onMove"
  | "startOfTurn"
  | "endOfTurn";

export type ActionType =
  | "playCard"
  | "inkCard"
  | "quest"
  | "challenge"
  | "activateAbility"
  | "move"
  | "sing"
  | "pass"
  | "concede"
  | "turnStart"
  | "turnEnd"
  | "phaseStep"
  | "phaseTransition"
  | "draw";
export type PlayerId = string;
export type InstanceId = string;

// Ovie's implementation
// export type CardDefinition = {
//   id: string;
//   name: string;
//   version: string;
//   collector_number: string;
//   set: string;
//   cost: number;
//   inkwell: boolean;
//   ink: InkType | null;
//   inks: InkType[] | null;
//   type: CardType[];
//   classifications: CardClassification[];
//   text: string;
//   keywords: string[];
//   moveCost?: number;
//   strength?: number;
//   willpower?: number;
//   lore?: number;
//   abilities?: AbilityDefinition[];
// };
// export type CardInstance = {
//   definitionId: string;
//   instanceId: string;
//   status: CardStatus;
//   damage: number;
//   owner: string;
//   controller?: string;
//   locationId: string;
//   attachedCards?: CardInstance[];
//   modifiers: Modifier[];
//   originalCharacter?: CardInstance;
//   isWet: boolean;
//   playedIndex?: number;
// };
// type AbilityTarget = {
//   type: "Card" | "Player";
//   zone?: Zone;
//   controller?: "Self" | "Opponent" | "Any";
//   count?: number | DynamicValue;
//   filter?: Filter;
//   text?: string;
//   targetAll?: boolean;
// };
// export type Filter = {
//   type?: CardType[];
//   zone?: Zone;
//   classifications?: CardClassification[];
//   controller?: "Self" | "Opponent" | "Any";
//   damage?: number;
//   damaged?: boolean;
//   exerted?: boolean;
//   excludeSelf?: boolean;
//   stat?: {
//     type: "Strength" | "Willpower" | "Lore";
//     minimum?: number;
//     maximum?: number;
//   };
//   location?: "Source" | "Destination";
//   challenge?: "attacker" | "defender" | "both";
//   cost?: {
//     minimum?: number;
//     maximum?: number;
//   };
// };
// export type CardInstance = {
//   definitionId: string;
//   instanceId: string;
//   status: CardStatus;
//   damage: number;
//   owner: string;
//   controller?: string;
//   locationId: string;
//   attachedCards?: CardInstance[];
//   modifiers: Modifier[];
//   originalCharacter?: CardInstance;
//   isWet: boolean;
//   playedIndex?: number;
// };

export type PublicId = string;
export type GameCards = Record<PlayerId, Record<InstanceId, PublicId>>;
