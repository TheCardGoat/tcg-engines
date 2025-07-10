import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type {
  TargetFilter,
  TriggerTargetFilter,
} from "@lorcanito/lorcana-engine/store/resolvers/filters";

export type CardEffectTarget = {
  type: "card";
  // TODO: instead of all I should make it optional and default to all
  // TODO: Probably should remove it completely
  value: "all" | number | DynamicAmount;
  // this is meant to simulate `your other characters` by removing the source card from the list
  excludeSelf?: boolean;
  // This flag will auto include the source card in the target list
  includeSelf?: boolean;
  upTo?: boolean;
  random?: boolean;
  filters: TargetFilter[];
};

export type PlayerEffectTarget =
  | {
      type: "player";
      value: "self" | "opponent" | "all" | "target_owner" | "target";
    }
  | {
      type: "player";
      value: "player_id";
      id: string;
    };

export type EffectTargets = CardEffectTarget | PlayerEffectTarget;

export const cardEffectTargetPredicate = (
  target?: EffectTargets,
): target is CardEffectTarget => target?.type === "card";

export const playerEffectTargetPredicate = (
  target?: EffectTargets,
): target is PlayerEffectTarget => target?.type === "player";

export const challengeFilterPredicate = (
  filter?: TargetFilter,
): filter is {
  filter: "challenge";
  value: "attacker" | "defender";
} => filter?.filter === "challenge";

export const singFilterPredicate = (
  filter?: TargetFilter,
): filter is {
  filter: "sing";
  value: "singer" | "song";
} => filter?.filter === "sing";

export const triggerFilterPredicate = (
  filter?: TargetFilter,
): filter is TriggerTargetFilter => filter?.filter === "trigger";
