import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveExecutableAbility,
  GrandArchiveRulesAbilityKind,
} from "./ability.ts";
import type { GrandArchiveObservableEventName } from "./primitives.ts";
import type { GrandArchiveEventPattern } from "./trigger.ts";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;
type Assert<Condition extends true> = Condition;

/** Adding an executable ability kind must update the declared engine taxonomy. */
type ExecutableKindsAreOwned = Assert<
  Equal<
    GrandArchiveExecutableAbility["kind"],
    | GrandArchiveRulesAbilityKind
    | "ability-modifier"
    | "card-resolution"
    | "composite"
    | "game-setup"
    | "keyword-group"
  >
>;

/** Parser debt is the only non-executable card-definition variant. */
type DefinitionKindsAreClosed = Assert<
  Equal<GrandArchiveAbilityDefinition["kind"], GrandArchiveExecutableAbility["kind"] | "unparsed">
>;

/** Every kernel event has a corresponding trigger-pattern member. */
type TriggerEventsAreComplete = Assert<
  Equal<GrandArchiveEventPattern["name"], GrandArchiveObservableEventName>
>;

export type GrandArchiveAbilityModelContract =
  | ExecutableKindsAreOwned
  | DefinitionKindsAreClosed
  | TriggerEventsAreComplete;
