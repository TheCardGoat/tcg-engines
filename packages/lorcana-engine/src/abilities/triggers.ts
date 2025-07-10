import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
import type {
  CardEffectTarget,
  EffectTargets,
  PlayerEffectTarget,
} from "../effects/effectTargets";
import type { TargetFilter } from "../store/resolvers/filters";

export type Trigger =
  | QuestTrigger
  | ReadyTrigger
  | ExertTrigger
  | DiscardTrigger
  | SingTrigger
  | DamageTrigger
  | HealTrigger
  | OnShiftTrigger
  | MovesToLocationTrigger
  | StartTurnTrigger
  | EndTurnTrigger
  | OnMoveTrigger
  | BanishAnotherTrigger
  | BanishTrigger
  | DrawTrigger
  | ChallengeTrigger;

interface BaseTrigger {
  on: Trigger["on"];
  conditions?: Condition[];
  oncePerTurn?: boolean;
  // Restrict trigger by the player that triggers it
  triggeredByPlayer?: "self" | "opponent";
  // Enables the trigger to be triggered from the discard pile
  doesItTriggerFromDiscard?: boolean;
}

export interface ChallengeTrigger extends BaseTrigger {
  on: "challenge";
  as?: "attacker" | "defender";
  filters?: TargetFilter[];
  secondaryFilters?: TargetFilter[];
}
export interface OnShiftTrigger extends BaseTrigger {
  on: "shift";
  shifterFilter: TargetFilter[];
  shiftedFilter: TargetFilter[];
}

export interface BanishTrigger extends BaseTrigger {
  on: "banish";
  in?: "challenge";
  as?: "attacker" | "defender" | "both";
  exclude?: "source";
  filters?: TargetFilter[];
}

export interface QuestTrigger extends BaseTrigger {
  on: "quest";
  target: CardEffectTarget;
}

export interface ExertTrigger extends BaseTrigger {
  on: "exert";
  target: CardEffectTarget;
}

export interface ReadyTrigger extends BaseTrigger {
  on: "ready";
  target: CardEffectTarget;
}

export interface DiscardTrigger extends BaseTrigger {
  on: "discard";
  player: "self" | "opponent";
}

export interface DrawTrigger extends BaseTrigger {
  on: "draw";
  player: "self" | "opponent" | "both";
}

export interface OnMoveTrigger extends BaseTrigger {
  on: "play" | "leave" | "inkwell";
  destination?: "hand" | "discard";
  hasShifted?: boolean;
  hasSang?: boolean;
  target: CardEffectTarget;
  from?: Zones;
}

export interface StartTurnTrigger extends BaseTrigger {
  on: "start_turn";
  target: PlayerEffectTarget;
}

export interface EndTurnTrigger extends BaseTrigger {
  on: "end_turn";
  target: EffectTargets;
}

interface DamageReceivedTrigger extends BaseTrigger {
  on: "damage";
  received: true;
  dealt?: never;
  inAChallenge?: boolean;
  filters: TargetFilter[];
  defenderFilters?: never;
}

interface DamageDealtTrigger extends BaseTrigger {
  on: "damage";
  received?: never;
  dealt: true;
  inAChallenge?: boolean;
  filters: TargetFilter[];
  defenderFilters?: TargetFilter[];
}

export type DamageTrigger = DamageReceivedTrigger | DamageDealtTrigger;

export interface HealTrigger extends BaseTrigger {
  on: "heal";
  filters: TargetFilter[];
}

export interface BanishAnotherTrigger extends BaseTrigger {
  on: "banish-another";
  cardType: "character" | "location";
}

export interface MovesToLocationTrigger extends BaseTrigger {
  on: "moves-to-a-location";
  target: CardEffectTarget;
  source?: CardEffectTarget;
  movingFrom?: TargetFilter[];
}

export interface SingTrigger extends BaseTrigger {
  on: "sing";
  // Restrict the trigger to only trigger if the trigger source card has sang the song
  onlySelf?: boolean;
  target: EffectTargets;
}
