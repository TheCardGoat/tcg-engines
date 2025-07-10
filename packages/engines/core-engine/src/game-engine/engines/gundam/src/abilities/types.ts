import type { Condition } from "./conditions/types";
import type { Effect } from "./effects/types";

export interface BaseAbility {
  type?:
    | "main"
    | "action"
    | "deploy"
    | "static"
    | "when-paired"
    | "destroyed"
    | "attack"
    | "burst";
  responder?: "self" | "opponent";
  conditions?: Condition[];
  name?: string;
  text?: string;
  effects?: Effect[];
}

export interface MainAbility extends BaseAbility {
  type: "main";
  effects: Effect[];
}

export interface ActionAbility extends BaseAbility {
  type: "action";
  effects: Effect[];
}

export interface DeployAbility extends BaseAbility {
  type: "deploy";
  effects: Effect[];
}

export interface BurstAbility extends BaseAbility {
  type: "burst";
  effects: Effect[];
}

export interface WhenPaired extends BaseAbility {
  type: "when-paired";
  effects: Effect[];
}

export interface Destroyed extends BaseAbility {
  type: "destroyed";
  conditions?: Condition[];
  effects: Effect[];
}

export interface Attack extends BaseAbility {
  type: "attack";
  conditions?: Condition[];
  effects: Effect[];
}

export interface StaticAbility extends BaseAbility {
  type: "static";
  abilityType: "blocker" | "repair" | "breach" | "high-maneuver";
  value?: number;
}

export interface RepairAbility extends StaticAbility {
  abilityType: "repair";
  value: number;
}

export interface BlockerAbility extends StaticAbility {
  abilityType: "blocker";
}

export interface BreachAbility extends StaticAbility {
  abilityType: "breach";
  value: number;
}

export interface HighManeuverAbility extends StaticAbility {
  abilityType: "high-maneuver";
}

export type StaticAbilities =
  | RepairAbility
  | BlockerAbility
  | BreachAbility
  | HighManeuverAbility;

export const isBlockerAbility = (ability: Ability): ability is BlockerAbility =>
  ability.type === "static" && ability.abilityType === "blocker";

export type Ability =
  | MainAbility
  | ActionAbility
  | DeployAbility
  | WhenPaired
  | Destroyed
  | Attack
  | BurstAbility
  | StaticAbilities;
