/**
 * Authoring factories for the canonical card-encoding idioms.
 *
 * Card modules compose these instead of re-inlining literal AST fragments, so
 * each idiom exists exactly once: the attack-action type-box filter, the
 * next-attack-action latch (CR 6.2.4), and the common resolution effects.
 * These are pure constructors over the existing effect/filter IR — no new
 * discriminants, no new status slugs.
 */

import type { FabExactTypeBoxFilter, FabCardFilter } from "./filter.ts";
import type { FabCondition } from "./condition.ts";
import type { FabEffect } from "./effect.ts";
import type { FabKeyword } from "./keyword.ts";
import type {
  FabNonTriggeredStaticAbility,
  FabResolutionAbility,
  FabTriggeredResolution,
  FabTriggeredStaticAbility,
  FleshAndBloodAbility,
} from "./ability.ts";
import type { FabTriggerObservationByEvent } from "./trigger.ts";
import type { FabDuration, FabPlayer } from "./primitives.ts";
import type { FabTarget } from "./target.ts";
import type { FabSubtype, FabType, FabTypeBox } from "../base-object-properties.ts";

// ---------------------------------------------------------------------------
// Pitch / color identity (CR 2.1)
// ---------------------------------------------------------------------------

/** Pitch is the identity; color is derived (purple / Chi may override). */
export const PITCH_TO_COLOR = {
  "1": "Red",
  "2": "Yellow",
  "3": "Blue",
  "4": "Purple",
} as const;

/** Inverse table used when canonical authoring derives pitch from color. */
export const COLOR_TO_PITCH = {
  Red: "1",
  Yellow: "2",
  Blue: "3",
  Purple: "4",
} as const;

export type PitchValue = keyof typeof PITCH_TO_COLOR;
export type PitchColor = keyof typeof COLOR_TO_PITCH;

export function colorFromPitch(pitch: PitchValue): PitchColor {
  return PITCH_TO_COLOR[pitch];
}

export function pitchFromColor(color: PitchColor): PitchValue {
  return COLOR_TO_PITCH[color];
}

/** Phrases that are type-boxes, not card names. `namedCard` rejects these. */
export const FAB_TYPE_BOX_NAME_PHRASES = [
  "Attack Action Card",
  "Guardian Attack Action",
  "Aura Token",
  "Draconic Attack",
  "Mechanologist Item",
] as const;

export type FabTypeBoxNamePhrase = (typeof FAB_TYPE_BOX_NAME_PHRASES)[number];

export function namedCard<N extends string>(
  name: N extends FabTypeBoxNamePhrase ? never : N,
): { name: N } {
  return { name };
}

// ---------------------------------------------------------------------------
// First-class condition factories
// ---------------------------------------------------------------------------

type ConditionOf<Type extends FabCondition["type"]> = Extract<FabCondition, { type: Type }>;

export function compareAmount(
  amount: ConditionOf<"compare-amount">["amount"],
  comparison: ConditionOf<"compare-amount">["comparison"],
): ConditionOf<"compare-amount"> {
  return { type: "compare-amount", amount, comparison };
}

export function performedThisTurn(
  event: ConditionOf<"performed-this-turn">["event"],
  player: ConditionOf<"performed-this-turn">["player"] = "controller",
): ConditionOf<"performed-this-turn"> {
  return { type: "performed-this-turn", event, player };
}

export function zoneCount(
  fields: Omit<ConditionOf<"zone-count">, "type">,
): ConditionOf<"zone-count"> {
  return { type: "zone-count", ...fields };
}

export function bindingMatches(
  binding: string,
  filter: FabCardFilter,
): ConditionOf<"binding-matches"> {
  return { type: "binding-matches", binding, filter };
}

// ---------------------------------------------------------------------------
// Attack-action type-box filters
// ---------------------------------------------------------------------------

/**
 * The exact attack-action type box (`types: ["Action"], subtypes: ["Attack"]`).
 * Extra filter fields ride alongside; an `extra.typeBox` is structurally
 * merged over the base box (e.g. adding `supertypes`).
 */
export function attackActionFilter(
  extra?: Omit<FabCardFilter, "typeBox"> & { typeBox?: FabExactTypeBoxFilter },
): FabCardFilter {
  return {
    ...extra,
    typeBox: {
      types: ["Action"],
      subtypes: ["Attack"],
      ...extra?.typeBox,
    },
  };
}

/** Structured attack-action type-box (not a `name:` phrase). */
export function attackAction(extra?: Partial<FabTypeBox>): FabTypeBox {
  return {
    metatypes: extra?.metatypes ?? [],
    supertypes: extra?.supertypes ?? [],
    types: (extra?.types as readonly FabType[] | undefined) ?? ["Action"],
    subtypes: (extra?.subtypes as readonly FabSubtype[] | undefined) ?? ["Attack"],
    ...(extra?.supertypeSets ? { supertypeSets: extra.supertypeSets } : {}),
  };
}

/** Token Aura type-box. */
export function tokenAura(extra?: Partial<FabTypeBox>): FabTypeBox {
  return {
    metatypes: extra?.metatypes ?? ["Token"],
    supertypes: extra?.supertypes ?? [],
    types: extra?.types ?? ["Token"],
    subtypes: extra?.subtypes ?? ["Aura"],
    ...(extra?.supertypeSets ? { supertypeSets: extra.supertypeSets } : {}),
  };
}

const EQUIPMENT_SEATS = {
  head: "Head",
  chest: "Chest",
  arms: "Arms",
  legs: "Legs",
  "off-hand": "Off-Hand",
} as const;

export type EquipmentSeat = keyof typeof EQUIPMENT_SEATS;

/** Equipment in a printed seat (Head / Chest / Arms / Legs / Off-Hand). */
export function equipmentSeat(seat: EquipmentSeat, extra?: Partial<FabTypeBox>): FabTypeBox {
  return {
    metatypes: extra?.metatypes ?? [],
    supertypes: extra?.supertypes ?? [],
    types: extra?.types ?? ["Equipment"],
    subtypes: extra?.subtypes ?? [EQUIPMENT_SEATS[seat]],
    ...(extra?.supertypeSets ? { supertypeSets: extra.supertypeSets } : {}),
  };
}

/**
 * The floating-applicator latch for "the next attack action card you play
 * this turn …" (CR 6.2.4): an `appliesTo.next` restricted to attack actions.
 */
export function nextAttackActionLatch(
  extraFilter?: Omit<FabCardFilter, "typeBox"> & { typeBox?: FabExactTypeBoxFilter },
): { next: FabCardFilter } {
  return { next: attackActionFilter(extraFilter) };
}

// ---------------------------------------------------------------------------
// Resolution-effect factories
// ---------------------------------------------------------------------------

/** `+N{p}` on this attack this turn, or the caller's latch/subject override. */
export function plusPower(
  amount: number,
  options: {
    duration?: FabDuration;
    appliesTo?: NonNullable<FabEffect["appliesTo"]>;
    target?: FabTarget;
  } = {},
): FabEffect {
  const latchNeedsCurrentSubject = Boolean(
    options.appliesTo?.count && options.appliesTo.count !== 1,
  );
  const dummyTarget =
    options.appliesTo && !latchNeedsCurrentSubject
      ? undefined
      : (options.target ?? { selector: "this-attack" });
  return {
    type: "modify-numeric",
    property: "power",
    op: "add",
    amount,
    ...(options.target ? { target: options.target } : dummyTarget ? { target: dummyTarget } : {}),
    duration: options.duration ?? "this-turn",
    ...(options.appliesTo === undefined ? {} : { appliesTo: options.appliesTo }),
  };
}

/** Grant a printed keyword (go again, dominate, …) to this attack this turn. */
export function grantKeyword(
  keyword: FabKeyword,
  options: {
    duration?: FabDuration;
    appliesTo?: NonNullable<FabEffect["appliesTo"]>;
    target?: FabTarget;
  } = {},
): FabEffect {
  const dummyTarget = options.appliesTo
    ? undefined
    : (options.target ?? { selector: "this-attack" });
  return {
    type: "grant-property",
    property: { kind: "keyword", keyword },
    ...(options.target ? { target: options.target } : dummyTarget ? { target: dummyTarget } : {}),
    duration: options.duration ?? "this-turn",
    ...(options.appliesTo === undefined ? {} : { appliesTo: options.appliesTo }),
  };
}

/**
 * "The next attack action card you play this turn …" latch wrapping a grant.
 * Omitting a dummy `this-attack` target; registration also strips leftovers.
 */
export function nextAttackAction(args: {
  filter?: Omit<FabCardFilter, "typeBox"> & { typeBox?: FabExactTypeBoxFilter };
  grant: FabEffect;
}): FabEffect {
  const { target: _dummy, ...grant } = args.grant as FabEffect & { target?: FabTarget };
  const keepTarget = _dummy && _dummy.selector !== "this-attack" ? { target: _dummy } : {};
  return {
    ...grant,
    ...keepTarget,
    appliesTo: {
      ...nextAttackActionLatch(args.filter),
      ...("appliesTo" in grant ? grant.appliesTo : {}),
    },
  } as FabEffect;
}

/**
 * Look at cards, bind them, then run a follow-up. `outputBinding` is required
 * so the next step cannot silently no-op.
 */
export function lookThen(args: {
  target: FabTarget;
  outputBinding: "it";
  then: FabEffect;
  duration?: FabDuration;
  choiceFilter?: FabCardFilter;
}): FabEffect {
  return {
    type: "sequence",
    steps: [
      {
        type: "look",
        target: args.target,
        outputBinding: args.outputBinding,
        ...(args.duration === undefined ? {} : { duration: args.duration }),
        ...(args.choiceFilter === undefined ? {} : { choiceFilter: args.choiceFilter }),
      },
      args.then,
    ],
  };
}

/** Draw `count` cards for `player` (default the controller). */
export function draw(count: number, player: FabPlayer = "controller"): FabEffect {
  return { type: "draw", count, player };
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CreateTokenFields = DistributiveOmit<
  Extract<FabEffect, { type: "create-token" }>,
  "type"
>;

/** Create a token. `createToken("might", 1)` or the full create-token leaf. */
export function createToken(
  token: string,
  count?: number,
): Extract<FabEffect, { type: "create-token" }>;
export function createToken(
  fields: CreateTokenFields,
): Extract<FabEffect, { type: "create-token" }>;
export function createToken(
  tokenOrFields: string | CreateTokenFields,
  count?: number,
): Extract<FabEffect, { type: "create-token" }> {
  if (typeof tokenOrFields === "string") {
    return {
      type: "create-token",
      token: tokenOrFields,
      controller: "controller",
      ...(count === undefined ? {} : { count }),
    };
  }
  return { type: "create-token", ...tokenOrFields };
}

/** Draw is the default on-hit rider; wrap any resolution effect. */
export type RulesOnlyAbility<
  Ability extends FleshAndBloodAbility = FleshAndBloodAbility,
  Id extends string | undefined = undefined,
> = Ability extends FleshAndBloodAbility
  ? Omit<Ability, "id" | "text"> &
      (Id extends string
        ? { readonly id: Id; readonly text: "" }
        : { readonly id?: never; readonly text?: never })
  : never;

type AuthoredTriggeredEffectAbility = Omit<
  RulesOnlyAbility<FabTriggeredStaticAbility>,
  "resolution"
> & {
  readonly resolution: Extract<FabTriggeredResolution, { readonly kind: "effect" }>;
};

export function onHit(effect: FabEffect): AuthoredTriggeredEffectAbility {
  return {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: { kind: "player", player: "ability-controller" },
        observes: { kind: "source", selector: "attack" },
      },
    },
    resolution: { kind: "effect", effect },
  };
}

/** Resolution ability gated by the source having completed Fusion. */
export function fusedResolution(effect: FabEffect): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    condition: { type: "has-status", status: "fused" },
    effect,
  };
}

/** Continuous static ability active while the source is fused. */
export function fusedWhile(effect: FabEffect): RulesOnlyAbility<FabNonTriggeredStaticAbility> {
  return {
    kind: "static",
    staticKind: "continuous",
    condition: { type: "has-status", status: "fused" },
    effect,
  };
}

type DelayedTriggerEffect = Extract<FabEffect, { readonly type: "delayed-trigger" }>;

/** Repeating "whenever ... this turn" delayed-trigger window. */
export function wheneverThisTurn(args: {
  readonly trigger: DelayedTriggerEffect["trigger"];
  readonly effect: FabEffect;
}): DelayedTriggerEffect {
  return {
    type: "delayed-trigger",
    trigger: args.trigger,
    policy: { kind: "windowed", duration: "this-turn", matching: "every" },
    resolution: { kind: "effect", effect: args.effect },
  };
}

/** Grant a rules-only ability onto this source without authoring id/text placeholders. */
export function grantAbilityToSelf(
  semanticKey: string,
  ability: RulesOnlyAbility<FleshAndBloodAbility>,
  duration: FabDuration = "permanent",
): FabEffect {
  return {
    type: "grant-property",
    property: { kind: "ability", ability: stampRulesOnlyAbility(ability, semanticKey) },
    target: { selector: "self" },
    duration,
  };
}

/** Exhaustive authoring-to-runtime identity stamp; adding an ability kind breaks here. */
function stampRulesOnlyAbility(
  ability: RulesOnlyAbility<FleshAndBloodAbility>,
  id: string,
): FleshAndBloodAbility {
  switch (ability.kind) {
    case "activated":
      return { ...ability, id, text: "" };
    case "resolution":
      return { ...ability, id, text: "" };
    case "modal":
      return { ...ability, id, text: "" };
    case "static":
      return { ...ability, id, text: "" };
    default: {
      const exhaustive: never = ability;
      return exhaustive;
    }
  }
}

/** Discard `count` random cards from `player`'s hand (Crush default: attack-target). */
export function discardRandom(count: number, player: FabPlayer = "attack-target"): FabEffect {
  return {
    type: "discard",
    random: true,
    target: {
      selector: "object",
      declared: "at-resolution",
      player,
      zones: ["hand"],
      count,
    },
  };
}

/** Wrap a resolution effect as rules-only authoring; the semantic map key stamps its id. */
export function resolutionAbility(effect: FabEffect): RulesOnlyAbility<FabResolutionAbility> {
  return { kind: "resolution", effect };
}

// ---------------------------------------------------------------------------
// Label-keyword ability factories (CR 8.4 combo / 8.5 crush)
// ---------------------------------------------------------------------------

/**
 * Canonical Crush trigger event (CR 8.5). Registration expands crush
 * keyword/label + unique rider using this shape — card modules must not
 * restate it.
 */
export const CRUSH_TRIGGER_EVENT = {
  name: "dealt-damage",
  actor: { kind: "any" },
  observes: { kind: "none" },
  amount: { op: "gte", value: 4 },
  target: { kind: "hero" },
} as const;

export type CrushRiderAbility<Id extends string | undefined = undefined> = RulesOnlyAbility<
  FabResolutionAbility,
  Id
> & {
  readonly crushObserves?: FabTriggerObservationByEvent["dealt-damage"];
};

/**
 * Unique Crush rider only. The 4+ damage trigger is expanded at
 * registration (`expandLabelKeywordAbilities`).
 */
export function crushAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
  observes?: FabTriggerObservationByEvent["dealt-damage"];
}): CrushRiderAbility;
export function crushAbility<const Id extends string>(args: {
  id: Id;
  text?: never;
  effect: FabEffect;
  /**
   * Observer restriction for variant Crush triggers ("when this deals 4 or
   * more damage to a hero with a Guardian…" — MPG Annexations). Defaults to
   * the canonical WTR043 `none` observer.
   */
  observes?: FabTriggerObservationByEvent["dealt-damage"];
}): CrushRiderAbility<Id>;
export function crushAbility(args: {
  id?: string;
  text?: never;
  effect: FabEffect;
  observes?: FabTriggerObservationByEvent["dealt-damage"];
}): CrushRiderAbility<string> | CrushRiderAbility {
  const ability = {
    kind: "resolution",
    effect: args.effect,
    functionalZones: ["combat-chain"],
    label: { name: "crush" },
    ...(args.observes ? { crushObserves: args.observes } : {}),
  } as const;
  return args.id === undefined ? ability : { ...ability, id: args.id, text: "" };
}

/**
 * CR 8.4 Combo as a while-static ("If X was the last attack this combat
 * chain, this gains…" — Cintari-style chain statics rather than a
 * resolution-time rider).
 */
export type ComboLastAttack = {
  names?: readonly string[];
  nameIncludes?: readonly string[];
  color?: "Red" | "Yellow" | "Blue";
  filter?: FabCardFilter;
};

type ComboRiderFields = { readonly comboFilter?: FabCardFilter };
export type ComboRiderAbility =
  | (RulesOnlyAbility<FabNonTriggeredStaticAbility> & ComboRiderFields)
  | (AuthoredTriggeredEffectAbility & ComboRiderFields)
  | (RulesOnlyAbility<FabResolutionAbility> & ComboRiderFields);

function comboLabel(args: ComboLastAttack): NonNullable<FleshAndBloodAbility["label"]> {
  const params: Record<string, string | number | readonly string[]> = {};
  if (args.names) params.names = args.names;
  if (args.nameIncludes) params.nameIncludes = args.nameIncludes;
  if (args.color) params.color = args.color;
  return Object.keys(params).length ? { name: "combo", params } : { name: "combo" };
}

function comboRiderFields(args: ComboLastAttack): {
  label: NonNullable<FleshAndBloodAbility["label"]>;
  comboFilter?: FabCardFilter;
} {
  return {
    label: comboLabel(args),
    ...(args.filter ? { comboFilter: args.filter } : {}),
  };
}

export function comboStatic(args: {
  id?: never;
  text?: never;
  names?: readonly string[];
  nameIncludes?: readonly string[];
  color?: "Red" | "Yellow" | "Blue";
  filter?: FabCardFilter;
  effect: FabEffect;
}): ComboRiderAbility {
  return {
    kind: "static",
    staticKind: "continuous",
    effect: args.effect,
    ...comboRiderFields(args),
  };
}

/**
 * CR 8.4 Combo resolution: unique rider only. The last-attack gate is
 * expanded at registration (`expandLabelKeywordAbilities`). Play-static cost
 * reductions stay separate abilities — they apply at quote time.
 */
export function comboResolution(args: {
  id?: never;
  text?: never;
  names?: readonly string[];
  nameIncludes?: readonly string[];
  color?: "Red" | "Yellow" | "Blue";
  filter?: FabCardFilter;
  effect: FabEffect;
}): ComboRiderAbility {
  return {
    kind: "resolution",
    effect: args.effect,
    ...comboRiderFields(args),
  };
}

/**
 * Combo unique rider. `on` selects resolution, while-static, or "when this
 * attacks" (Chase the Tail). Last-attack identity stays on the rider; the
 * shared CR 8.4 gate is filled at load.
 */
export function comboAbility(
  args: ComboLastAttack & {
    id?: never;
    text?: never;
    effect: FabEffect;
    on?: "resolution" | "static" | "attack";
  },
): ComboRiderAbility {
  const on = args.on ?? "resolution";
  if (on === "static") return comboStatic(args);
  if (on === "attack") {
    return {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: { kind: "effect", effect: args.effect },
      ...comboRiderFields(args),
    };
  }
  return comboResolution(args);
}

/** Reprise unique rider. Shared "defended with a card from hand this chain link" is expanded at load. */
export function repriseAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
}): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    effect: args.effect,
    label: { name: "reprise" },
  };
}

/** Surge unique rider. Shared "if this deals more than N damage" is expanded at load. */
export function surgeAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
  threshold?: number;
}): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    effect: args.effect,
    label: {
      name: "surge",
      ...(args.threshold === undefined ? {} : { params: { threshold: args.threshold } }),
    },
  };
}

/** Rupture unique rider. Shared "played as chain link 4 or higher" is expanded at load. */
export function ruptureAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
}): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    effect: args.effect,
    label: { name: "rupture" },
  };
}

/** High Tide unique rider. Shared "2 or more blue cards in pitch" is expanded at load. */
export function highTideAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
}): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    effect: args.effect,
    label: { name: "high-tide" },
  };
}

/** Lightning Flow unique rider. Shared "played a Lightning card this turn" is expanded at load. */
export function lightningFlowAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
}): RulesOnlyAbility<FabResolutionAbility> {
  return {
    kind: "resolution",
    effect: args.effect,
    label: { name: "lightning-flow" },
  };
}

export type BondTalent = "Earth" | "Ice" | "Lightning";

const BOND_LABEL = {
  Earth: "earth-bond",
  Ice: "ice-bond",
  Lightning: "lightning-bond",
} as const satisfies Record<BondTalent, "earth-bond" | "ice-bond" | "lightning-bond">;

/**
 * Bond unique rider. Shared "if a {talent} card was pitched to play this"
 * (CR 8.4.15) is expanded at load from the label. Typical form is on-resolution;
 * `on: "attack"` is the "When this attacks, if …" printing (Bracken Rap).
 */
export function bondAbility(args: {
  id?: never;
  text?: never;
  effect: FabEffect;
  talent: BondTalent;
  on?: "resolution" | "attack";
}): RulesOnlyAbility<FabResolutionAbility> | AuthoredTriggeredEffectAbility {
  const label = { name: BOND_LABEL[args.talent] };
  if (args.on === "attack") {
    return {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: { kind: "effect", effect: args.effect },
      label,
    };
  }
  return {
    kind: "resolution",
    effect: args.effect,
    label,
  };
}
