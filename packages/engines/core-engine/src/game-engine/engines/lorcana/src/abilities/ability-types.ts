import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

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

export type AbilityDuration =
  | { type: "endOfTurn" }
  | { type: "untilLeaves" }
  | { type: "turns"; count: number }
  | { type: "permanent" };

export type DynamicValue = {
  type: "count" | "targetDamage" | "lastEffectValue" | "sourceStat";
  filter?: LorcanaCardFilter;
  stat?: "strength" | "willpower" | "lore";
  multiplier?: number;
};

export type AbilityTarget = {
  type: "card" | "player";
  zone?: LorcanaZone;
  controller?: "self" | "opponent" | "any";
  count?: number | DynamicValue;
  filter?: LorcanaCardFilter;
  targetAll?: boolean;
};

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
  | "onActivatedAbility"
  | "startOfTurn"
  | "endOfTurn";
// | "OnPlay"
// | "OnLeavePlay"
// | "OnBanish"
// | "OnQuest"
// | "OnDamage"
// | "OnRemoveDamage"
// | "OnExert"
// | "OnReady"
// | "OnInk"
// | "OnDraw"
// | "OnDiscard"
// | "OnChallenge"
// | "WhileChallenging"
// | "WhileChallenged"
// | "OnTurnStart"
// | "OnTurnEnd"

export type ScryConfig = {
  lookAt: number;
  destinations: ScryDestination[];
};

export type ScryDestination = {
  zone: LorcanaZone;
  value?: number;
  location?: "Top" | "Bottom";
  shuffle?: boolean;
  remainder?: boolean;
  exerted?: boolean;
  order?: "playerChoice" | "random";
  filter?: LorcanaCardFilter;
  reveal?: boolean;
  max?: number;
  min?: number;
};
