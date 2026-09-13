import type {
  GrandArchiveActivatedAbility,
  GrandArchiveCardFace,
  GrandArchiveDefinitionKind,
  GrandArchiveCardResolution,
  GrandArchiveExecutableAbility,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { requireGrandArchiveCard } from "../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "./model.ts";

type FlatGrandArchiveAbility = Exclude<
  GrandArchiveExecutableAbility,
  { readonly kind: "composite" }
>;

/** A face-down double-faced field card is treated as an ordinary characteristicless card. */
export function grandArchiveObjectHasConcealedCharacteristics(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
): boolean {
  return (
    object.zone === "field" &&
    object.facing === "face-down" &&
    requireGrandArchiveCard(program, object.activeDefinitionId ?? object.definitionId).layout
      .kind === "double-faced"
  );
}

export function grandArchiveObjectPrintedAbilities(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
): readonly FlatGrandArchiveAbility[] {
  return grandArchiveObjectHasConcealedCharacteristics(program, object)
    ? []
    : flattenGrandArchiveAbilities(grandArchiveObjectFace(program, object).abilities);
}

/** Immutable definition arrays can share one flattened view for their lifetime. */
const flattenedAbilitiesByDefinition = new WeakMap<
  readonly GrandArchiveExecutableAbility[],
  readonly FlatGrandArchiveAbility[]
>();

export function grandArchiveObjectFace(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
): GrandArchiveCardFace<GrandArchiveExecutableAbility, GrandArchiveDefinitionKind> {
  const card = requireGrandArchiveCard(program, object.activeDefinitionId ?? object.definitionId);
  if (card.layout.kind === "single-faced") {
    return object.nameOverride
      ? { ...card.layout.face, name: object.nameOverride }
      : card.layout.face;
  }
  const face = object.face === "transformed" ? card.layout.flipFace : card.layout.defaultFace;
  return object.nameOverride ? { ...face, name: object.nameOverride } : face;
}

/**
 * Canonical player-facing name for an object at its current rules face.
 * Keeping this beside face resolution prevents logs and viewer projections
 * from drifting on transformed cards and copy effects with a name override.
 */
export function grandArchiveObjectDisplayName(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
): string {
  return grandArchiveObjectFace(program, object).name;
}

function abilityCostIncludesBanishSelf(cost: GrandArchiveActivatedAbility["cost"]): boolean {
  if (!cost) return false;
  if (cost.kind === "banish-self") return true;
  if (cost.kind === "all" || cost.kind === "one-of")
    return cost.costs.some(abilityCostIncludesBanishSelf);
  if (cost.kind === "optional") return abilityCostIncludesBanishSelf(cost.cost);
  return false;
}

const ACTION_CARD_ZONES = [
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "material-deck",
  "effects-stack",
  "intent",
] as const satisfies readonly GrandArchiveZone[];

/**
 * Abilities 6.1: action statics that modify the card itself (keywords, granted
 * abilities, characteristic changes, or activation permissions) function from
 * the card zones they are activated from, not only the Effects Stack.
 */
function actionStaticModifiesSourceCard(
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
): boolean {
  if (ability.kind !== "static" || ability.staticKind !== "effects") return false;
  return ability.effects.some((effect) => {
    if (effect.kind === "continuous") {
      if (effect.subjects.kind !== "source") return false;
      switch (effect.change.kind) {
        case "grant-keyword":
        case "remove-keyword":
        case "grant-ability":
        case "remove-abilities":
        case "numeric":
        case "add-characteristic":
        case "remove-characteristic":
        case "add-tracked-characteristic":
        case "set-elements":
        case "set-types":
          return true;
        default:
          return false;
      }
    }
    return (
      effect.kind === "rule-modification" &&
      effect.subject?.kind === "source" &&
      (effect.action === "activate" ||
        effect.action === "play" ||
        effect.action === "activate-fast")
    );
  });
}

/** Rules-defined default functional zone, unless the printed ability overrides it. */
export function grandArchiveAbilityFunctionalZones(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
): readonly GrandArchiveZone[] {
  if (ability.functionalZones) return ability.functionalZones;
  if (ability.executionSource === "lineage-host") return ["inner-lineage"];
  if (face.typeLine.types.includes("ATTACK")) return ["intent"];
  if (face.typeLine.types.includes("ACTION")) {
    if (actionStaticModifiesSourceCard(ability)) return ACTION_CARD_ZONES;
    return ["effects-stack", "intent"];
  }
  if (face.typeLine.types.includes("LESSER BOON") || face.typeLine.types.includes("GREATER BOON")) {
    return ["pantheon", "intent"];
  }
  if (
    ability.kind === "activated" &&
    ability.text
      .split(":")[0]
      .split(/,\s*/u)
      .some((part) => {
        const match = /(?:^|\]\s*)Banish (.+?) from your graveyard$/iu.exec(part.trim());
        if (!match) return false;
        const reference = match[1].toLowerCase();
        const name = face.name.toLowerCase();
        return (
          reference === "this card" ||
          reference === name ||
          name.startsWith(`${reference}, `) ||
          name.startsWith(`${reference} `)
        );
      }) &&
    abilityCostIncludesBanishSelf(ability.cost)
  ) {
    return ["graveyard", "intent"];
  }
  // Abilities 6: any card in intent functions as an object for its abilities.
  // Explicit functional zones and hosted execution sources above still take precedence.
  return ["field", "intent"];
}

export function grandArchiveAbilityIsFunctional(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
  object: GrandArchiveCardInstance,
): boolean {
  if (!grandArchiveAbilityFunctionalZones(face, ability).includes(object.zone)) return false;
  return !(
    object.zone === "pantheon" &&
    object.facing === "face-down" &&
    (face.typeLine.types.includes("LESSER BOON") || face.typeLine.types.includes("GREATER BOON"))
  );
}

/**
 * Resolves the rules object that owns and executes an ability whose text is
 * printed on a hosted card. The printed card remains the ability origin for
 * functional-zone checks and timestamps; the returned object supplies the
 * controller, source, and ability bearer used while evaluating the ability.
 */
export function grandArchiveAbilityExecutionObject(
  state: GrandArchiveMatchState,
  origin: GrandArchiveCardInstance,
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
): GrandArchiveCardInstance | undefined {
  if (!ability.executionSource) return origin;
  if (!origin.hostId) return undefined;
  if (ability.executionSource === "lineage-host" && origin.zone !== "inner-lineage") {
    return undefined;
  }
  if (ability.executionSource === "linked-object" && origin.zone !== "field") {
    return undefined;
  }
  const host = state.objects[origin.hostId];
  return host?.zone === "field" ? host : undefined;
}

export function flattenGrandArchiveAbilities(
  abilities: readonly GrandArchiveExecutableAbility[],
): readonly FlatGrandArchiveAbility[] {
  const cached = flattenedAbilitiesByDefinition.get(abilities);
  if (cached) return cached;
  const flattened = abilities.flatMap((ability) =>
    ability.kind === "composite" ? flattenGrandArchiveAbilities(ability.abilities) : [ability],
  );
  flattenedAbilitiesByDefinition.set(abilities, flattened);
  return flattened;
}

export function findGrandArchiveActivatedAbility(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
  abilityId: string,
): GrandArchiveActivatedAbility | undefined {
  return flattenGrandArchiveAbilities(face.abilities).find(
    (ability): ability is GrandArchiveActivatedAbility =>
      ability.kind === "activated" && ability.id === abilityId,
  );
}

export function findGrandArchiveCardResolution(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
): GrandArchiveCardResolution | undefined {
  return flattenGrandArchiveAbilities(face.abilities).find(
    (ability): ability is GrandArchiveCardResolution => ability.kind === "card-resolution",
  );
}

export function grandArchiveCardIsObject(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility>,
): boolean {
  return face.typeLine.types.some(
    (type) =>
      type === "ALLY" ||
      type === "CHAMPION" ||
      type === "DOMAIN" ||
      type === "ITEM" ||
      type === "PHANTASIA" ||
      type === "WEAPON" ||
      type === "LESSER BOON" ||
      type === "GREATER BOON",
  );
}

export function grandArchiveEffectPerformsAsSpell(
  effect: import("@tcg/grand-archive-types").GrandArchiveEffect | undefined,
): boolean {
  if (!effect) return false;
  switch (effect.kind) {
    case "perform-as":
      return effect.sourceKind === "spell";
    case "sequence":
      return effect.effects.some(grandArchiveEffectPerformsAsSpell);
    case "conditional":
      return (
        grandArchiveEffectPerformsAsSpell(effect.then) ||
        grandArchiveEffectPerformsAsSpell(effect.else)
      );
    case "optional":
      return (
        grandArchiveEffectPerformsAsSpell(effect.effect) ||
        grandArchiveEffectPerformsAsSpell(effect.otherwise)
      );
    case "attempt":
      return grandArchiveEffectPerformsAsSpell(effect.effect);
    case "bind-value":
      return grandArchiveEffectPerformsAsSpell(effect.effect);
    case "select-modes":
      // Callers supply only the modes actually selected for this stack item.
      return false;
    default:
      return false;
  }
}

export function grandArchiveCurrentNumericProperty(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
  property: "level" | "power" | "life" | "durability",
): number | undefined {
  const base = grandArchiveObjectFace(program, object).stats[property];
  if (base === undefined) return undefined;
  if (property === "power" || property === "life") {
    return base + (object.counters.buff ?? 0) - (object.counters.debuff ?? 0);
  }
  if (property === "level") return base + (object.counters.level ?? 0);
  return base;
}
