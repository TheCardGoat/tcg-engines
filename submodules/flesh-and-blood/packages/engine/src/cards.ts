/**
 * Engine-facing card definition slice. Printed catalog modules satisfy this
 * structurally; the engine never imports the cards package — adapters and the
 * test harness register definitions onto match state.
 */

import {
  FAB_OBSERVABLE_EVENT_NAMES,
  PITCH_TO_COLOR,
  assignAbilityIds,
  expandLabelKeywordAbilities,
  ensureLabelKeywords,
  cardNameFromSlug,
  normalizeBaseObjectProperties,
  rejectUnknownHasStatus,
  rejectOutOfScopeIdentity,
  type FabBaseObjectProperties,
  type FabCardFace,
  type FabCardLayout,
  type FabKeyword,
  type FabObservableEventName,
  type FabTypeBox,
  type FabSupertypeSets,
  type FleshAndBloodAbility,
  type FleshAndBloodCard,
} from "@tcg/flesh-and-blood-types";
import type { FabActiveFaceState } from "./game/objects.ts";

export type FabKeywordRef = FabKeyword;

/** CR 5.1.2c / 9.2.3 declaration captured when a split-card is announced. */
export type FabSplitPlayMethod =
  | { readonly kind: "face"; readonly face: "left" | "right" }
  | { readonly kind: "meld" };

/** Rules property profile carried by one card-object incarnation. */
export type FabCardPropertyState = { readonly kind: "whole-card" } | FabSplitPlayMethod;

interface FabCardDefinitionInputBase {
  readonly canonicalId: string;
  /** Catalog slug (e.g. `nimblism-blue`) when registered from a module. */
  readonly slug?: string;
  /** Printed display name when present on the catalog module. */
  readonly name?: string;
  /** Generated face model. Only `layout.kind === "split"` is executable here. */
  readonly layout?: FabCardLayout;
}

type FabNormalizedCardDefinitionInput = FabCardDefinitionInputBase & {
  /** Normalized printed properties consumed by rules evaluation. */
  readonly base: FabBaseObjectProperties;
  readonly types?: never;
  readonly supertypeSets?: never;
  readonly traits?: never;
  readonly pitch?: never;
  readonly cost?: never;
  readonly power?: never;
  readonly defense?: never;
  readonly health?: never;
  readonly intelligence?: never;
  readonly arcane?: never;
  readonly keywords?: never;
  readonly color?: never;
  readonly abilities?: never;
};

export type FabLooseCardDefinitionInput = FabCardDefinitionInputBase & {
  readonly base?: never;
  /** Legacy/test input is normalized and validated at registration. */
  readonly types: readonly string[];
  /** Parser-stage preservation of slash-delimited supertype grouping. */
  readonly supertypeSets?: FabSupertypeSets;
  readonly traits?: readonly string[];
  /** Printed pitch value (1 / 2 / 3). Catalog modules may use string form. */
  readonly pitch?: number | string;
  /** Printed resource cost. 0 is a valid printed cost. */
  readonly cost?: number;
  readonly power?: number;
  /** 0 is a valid printed defense; absent means no defense property. */
  readonly defense?: number;
  readonly health?: number;
  /** Hero intellect (draw-up-to target). Defaults to 4 when seating a hero. */
  readonly intelligence?: number;
  /** Printed arcane damage amount (Wizard actions, etc.). */
  readonly arcane?: number;
  /** Keyword objects or names from the catalog (`{ name: "go-again" }`). */
  readonly keywords?: readonly (string | FabKeywordRef)[];
  /** Color strip (Red / Yellow / Blue) when printed. */
  readonly color?: string;
  /**
   * Catalog ability AST (pass-through). Required for production resolution of
   * triggered effects (hit draw, pitch life, …). Must not be stripped.
   */
  readonly abilities?: readonly FleshAndBloodAbility[];
};

/** Registration accepts either an exact base record or a complete loose test/source record. */
export type FabCardDefinitionInput = FabNormalizedCardDefinitionInput | FabLooseCardDefinitionInput;

/** Exact runtime card shape admitted to match state. */
export type FabRegisteredCardDefinition = FleshAndBloodCard;

const FAB_LOOSE_DEFINITION_KEYS = [
  "types",
  "supertypeSets",
  "traits",
  "pitch",
  "cost",
  "power",
  "defense",
  "health",
  "intelligence",
  "arcane",
  "keywords",
  "color",
  "abilities",
] as const;

/** Canonical match-program key for an authored create-token name. */
export function fabCreatedObjectCanonicalId(name: string): string {
  const slug = name
    .replace(/^token:/i, "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  if (slug.length === 0) throw new Error("FAB created-object identity must not be empty.");
  return `token:${slug}`;
}

/** Resolve a created-name lookup key to the physical identity stored on an object. */
export function fabCreatedObjectRuntimeCanonicalId(
  definition: FabRegisteredCardDefinition,
  requestedCanonicalId: string,
): string {
  return definition.layout.kind === "twin" ? definition.canonicalId : requestedCanonicalId;
}

/** Extract an engine definition from any object carrying printed stats. */
export function toFabCardDefinition(card: FabCardDefinitionInput): FabRegisteredCardDefinition {
  if (card.base) {
    const mirrored = FAB_LOOSE_DEFINITION_KEYS.find((key) => Object.hasOwn(card, key));
    if (mirrored) {
      throw new Error(
        `FAB card ${card.canonicalId} cannot combine exact base properties with loose “${mirrored}” properties.`,
      );
    }
    return {
      canonicalId: card.canonicalId,
      slug: typeof card.slug === "string" ? card.slug : card.canonicalId,
      layout: card.layout ?? { kind: "single" },
      base: card.base,
    };
  }
  const pitchRaw = card.pitch;
  const name = card.name ?? (card.slug ? cardNameFromSlug(card.slug, pitchRaw) : undefined);
  const pitch =
    pitchRaw === undefined
      ? undefined
      : typeof pitchRaw === "number"
        ? pitchRaw
        : Number.parseInt(String(pitchRaw), 10);
  const pitchKey =
    pitch === 1 || pitch === 2 || pitch === 3 || pitch === 4
      ? (String(pitch) as "1" | "2" | "3" | "4")
      : undefined;
  const color =
    typeof card.color === "string" ? card.color : pitchKey ? PITCH_TO_COLOR[pitchKey] : undefined;
  rejectUnknownHasStatus(card.abilities, card.canonicalId);
  rejectOutOfScopeIdentity(card.abilities, card.canonicalId);
  const abilities =
    assignAbilityIds(
      expandLabelKeywordAbilities(card.abilities, { arcane: card.arcane }),
      card.canonicalId,
    ) ?? card.abilities;
  const keywords = ensureLabelKeywords(
    card.keywords as readonly import("@tcg/flesh-and-blood-types").FabKeyword[] | undefined,
    abilities,
  );
  const normalizedCard = { ...card, name, color, abilities, keywords };
  const base =
    card.layout?.kind === "split"
      ? wholeSplitBaseProperties(card.canonicalId, card.layout.faces, normalizedCard)
      : card.layout?.kind === "flip" ||
          card.layout?.kind === "twin" ||
          card.layout?.kind === "transcend"
        ? pairedFaceBaseProperties(card.canonicalId, card.layout.front, normalizedCard)
        : normalizeBaseObjectProperties({ ...normalizedCard, name });
  return {
    canonicalId: card.canonicalId,
    slug: typeof card.slug === "string" ? card.slug : card.canonicalId,
    layout: card.layout ?? { kind: "single" },
    base,
  };
}

/**
 * Resolve exactly the properties that a declared split face has on the stack.
 * This consumes generated face data only; display strings and slugs are never
 * used to infer a side. CR 9.2.3 makes the unchosen side cease to exist.
 */
export function declaredSplitBaseProperties(
  definition: FabRegisteredCardDefinition,
  declaration: FabSplitPlayMethod,
): FabBaseObjectProperties | null {
  if (definition.layout.kind !== "split") return null;
  const [left, right] = definition.layout.faces;
  if (declaration.kind === "face") {
    return faceBaseProperties(
      definition.canonicalId,
      declaration.face === "left" ? left : right,
      declaration.face,
      sharedPrintedProperties(definition),
    );
  }
  return wholeSplitBaseProperties(
    definition.canonicalId,
    [left, right],
    sharedPrintedProperties(definition),
  );
}

type FabSharedPrintedProperties = Pick<
  FabCardDefinitionInput,
  "color" | "pitch" | "cost" | "power" | "defense" | "health" | "intelligence"
>;

function sharedPrintedProperties(
  definition: FabRegisteredCardDefinition,
): FabSharedPrintedProperties {
  return {
    color: definition.base.color ?? undefined,
    pitch: definition.base.numeric.pitch,
    cost: definition.base.numeric.cost,
    power: definition.base.numeric.power,
    defense: definition.base.numeric.defense,
    health: definition.base.numeric.life,
    intelligence: definition.base.numeric.intellect,
  };
}

function faceBaseProperties(
  canonicalId: string,
  face: FabCardFace,
  side: "left" | "right",
  shared: FabSharedPrintedProperties,
): FabBaseObjectProperties {
  return normalizeBaseObjectProperties({
    canonicalId,
    faceId: `${canonicalId}:face:${side}`,
    textBoxId: `${canonicalId}:textbox:${side}`,
    name: face.name,
    types: face.types,
    traits: face.traits,
    color: shared.color,
    pitch: shared.pitch,
    cost: shared.cost,
    power: shared.power,
    defense: shared.defense,
    health: shared.health,
    intelligence: shared.intelligence,
    keywords: face.keywords,
    abilities: face.abilities,
  });
}

function pairedFaceBaseProperties(
  canonicalId: string,
  face: import("@tcg/flesh-and-blood-types").FabPairedCardFace,
  shared: FabSharedPrintedProperties,
): FabBaseObjectProperties {
  const base = normalizeBaseObjectProperties({
    canonicalId,
    faceId: face.faceId,
    textBoxId: `${face.faceId.replace(/:face:/, ":textbox:")}`,
    name: face.name,
    types: face.types,
    traits: face.traits,
    color: face.color ?? shared.color,
    pitch: face.numeric?.pitch ?? shared.pitch,
    cost: face.numeric?.cost ?? shared.cost,
    power: face.numeric?.power ?? shared.power,
    defense: face.numeric?.defense ?? shared.defense,
    health: face.numeric?.life ?? shared.health,
    intelligence: face.numeric?.intellect ?? shared.intelligence,
    keywords: face.keywords,
    abilities: face.abilities,
  });
  return { ...base, numeric: { ...base.numeric, ...face.numeric } };
}

function wholeSplitBaseProperties(
  canonicalId: string,
  faces: readonly [FabCardFace, FabCardFace],
  shared: FabSharedPrintedProperties,
): FabBaseObjectProperties {
  const leftBase = faceBaseProperties(canonicalId, faces[0], "left", shared);
  const rightBase = faceBaseProperties(canonicalId, faces[1], "right", shared);
  const merge = <Value>(a: readonly Value[], b: readonly Value[]): Value[] => [
    ...new Set([...a, ...b]),
  ];
  return {
    ...leftBase,
    names: [leftBase.names[0], rightBase.names[0]],
    activeFaceIds: [leftBase.activeFaceIds[0], rightBase.activeFaceIds[0]],
    typeBoxes: [leftBase.typeBoxes[0], rightBase.typeBoxes[0]],
    typeBox: mergeTypeBoxes([leftBase.typeBoxes[0], rightBase.typeBoxes[0]]),
    textBoxIds: [leftBase.textBoxIds[0], rightBase.textBoxIds[0]],
    traits: merge(leftBase.traits, rightBase.traits),
    keywords: merge(leftBase.keywords, rightBase.keywords),
    abilities: merge(leftBase.abilities, rightBase.abilities),
  };
}

function mergeTypeBoxes(typeBoxes: readonly FabTypeBox[]): FabTypeBox {
  const merge = <Value>(values: readonly (readonly Value[])[]): readonly Value[] => [
    ...new Set(values.flat()),
  ];
  return {
    metatypes: merge(typeBoxes.map((value) => value.metatypes)),
    supertypes: merge(typeBoxes.map((value) => value.supertypes)),
    types: merge(typeBoxes.map((value) => value.types)),
    subtypes: merge(typeBoxes.map((value) => value.subtypes)),
  };
}

/**
 * The single registration boundary allowed to classify legacy catalog type
 * tokens. Rules consumers receive this normalized record and never inspect
 * typeText or reclassify the flat token list.
 */
export { normalizeBaseObjectProperties } from "@tcg/flesh-and-blood-types";

/** Read the normalized base-property record stored at the registration boundary. */
export function basePropertiesOf(
  definition: FabRegisteredCardDefinition,
  propertyState: FabCardPropertyState = { kind: "whole-card" },
  activeFace: FabActiveFaceState = { kind: "single" },
): FabBaseObjectProperties {
  if (
    propertyState.kind === "whole-card" &&
    activeFace.kind === "paired" &&
    (definition.layout.kind === "flip" ||
      definition.layout.kind === "twin" ||
      definition.layout.kind === "transcend")
  ) {
    const selected = [definition.layout.front, definition.layout.back].filter((face) =>
      activeFace.activeFaceIds.includes(face.faceId),
    );
    if (selected.length === 0) throw new Error(`card ${definition.canonicalId} has no active face`);
    const bases = selected.map((face) =>
      pairedFaceBaseProperties(definition.canonicalId, face, sharedPrintedProperties(definition)),
    );
    return bases.length === 1 ? bases[0]! : mergeBaseProperties([bases[0]!, ...bases.slice(1)]);
  }
  if (propertyState.kind === "whole-card") return definition.base;
  if (propertyState.kind === "meld" && definition.layout.kind !== "split") return definition.base;
  const declared = declaredSplitBaseProperties(definition, propertyState);
  if (!declared) {
    throw new Error(
      `card ${definition.canonicalId} cannot use property state ${propertyState.kind}`,
    );
  }
  return declared;
}

function mergeBaseProperties(
  bases: readonly [FabBaseObjectProperties, ...FabBaseObjectProperties[]],
): FabBaseObjectProperties {
  const merge = <Value>(values: readonly (readonly Value[])[]): readonly Value[] => [
    ...new Set(values.flat()),
  ];
  const numeric = Object.assign({}, ...bases.map((base) => base.numeric));
  return {
    ...bases[0],
    names: merge(bases.map((base) => base.names)),
    activeFaceIds: merge(
      bases.map((base) => base.activeFaceIds),
    ) as FabBaseObjectProperties["activeFaceIds"],
    typeBoxes: merge(bases.map((base) => base.typeBoxes)) as FabBaseObjectProperties["typeBoxes"],
    typeBox: mergeTypeBoxes(bases.flatMap((base) => base.typeBoxes)),
    traits: merge(bases.map((base) => base.traits)),
    textBoxIds: merge(bases.map((base) => base.textBoxIds)),
    numeric,
    keywords: merge(bases.map((base) => base.keywords)),
    abilities: merge(bases.map((base) => base.abilities)),
  };
}

export function registerFabCardDefinition(
  definition: FabCardDefinitionInput,
): FabRegisteredCardDefinition {
  assertValidFabCardLayout(definition);
  assertValidFabTriggerPrograms(definition);
  return toFabCardDefinition(definition);
}

const FAB_OBSERVABLE_EVENT_NAME_SET = new Set<string>(FAB_OBSERVABLE_EVENT_NAMES);
interface FabRuntimeTriggerEventSpec {
  readonly source: readonly string[];
  readonly singular: readonly string[];
  readonly plural: readonly string[];
  readonly constraints: readonly string[];
}

const triggerEventSpec = (
  source: readonly string[],
  singular: readonly string[] = source,
  plural: readonly string[] = [],
  constraints: readonly string[] = [],
): FabRuntimeTriggerEventSpec => ({ source, singular, plural, constraints });

/** Runtime mirror of the closed trigger DSL. Compile-time and admission both fail closed. */
const FAB_TRIGGER_EVENT_SPECS = {
  attack: triggerEventSpec(["attack"], undefined, undefined, ["target", "fused", "amount"]),
  "attack-target-declared": triggerEventSpec(["attack"], undefined, undefined, ["target"]),
  hit: triggerEventSpec(["attack"], undefined, undefined, ["target", "fused", "amount"]),
  "deal-damage": triggerEventSpec(
    ["damage-source", "damage-target"],
    ["damage-source", "damage-target"],
    [],
    ["damageType", "amount", "target"],
  ),
  "dealt-damage": triggerEventSpec(
    ["damage-source", "damage-target"],
    ["damage-source", "damage-target"],
    [],
    ["damageType", "amount", "target"],
  ),
  prevent: triggerEventSpec(
    ["prevention-source"],
    ["prevention-source", "damage-source", "damage-target"],
    [],
    ["damageType", "amount", "target"],
  ),
  defend: triggerEventSpec(
    ["defender", "defended-attack"],
    ["defender", "defended-attack"],
    [],
    ["origin", "cohort", "defendedAttack", "bindDefendedAttackAs", "amount", "target"],
  ),
  play: triggerEventSpec(["played-card"], undefined, undefined, ["from"]),
  pitch: triggerEventSpec(["pitched-card"], undefined, undefined, ["amount"]),
  discard: triggerEventSpec(["discarded-card"], undefined, undefined, ["random", "amount"]),
  draw: triggerEventSpec(["drawn-card"], undefined, undefined, ["amount"]),
  banish: triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  destroy: triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  search: triggerEventSpec([], [], ["found-cards"], ["amount"]),
  boost: triggerEventSpec(["boosted-card"], ["boosted-card", "banished-card"], [], ["amount"]),
  fuse: triggerEventSpec(["fused-card"], ["fused-card"], ["revealed-cards"], ["amount"]),
  charge: triggerEventSpec(["charging-card"], ["charging-card", "charged-card"]),
  "clash-win": triggerEventSpec(["revealed-card"]),
  "clash-lose": triggerEventSpec(["revealed-card"]),
  wager: triggerEventSpec(["attack"]),
  "wager-win": triggerEventSpec(["attack"]),
  "enter-arena": triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  "leave-arena": triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  "put-into-graveyard": triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  "chain-link-resolve": triggerEventSpec(["attack"], undefined, undefined, ["didHit"]),
  "combat-chain-close": triggerEventSpec([], [], [], ["attackCount"]),
  "start-phase": triggerEventSpec([]),
  "end-phase": triggerEventSpec([]),
  "action-phase-start": triggerEventSpec([]),
  "reaction-step": triggerEventSpec(["attack"]),
  "counter-removed": triggerEventSpec(["object"], undefined, undefined, [
    "counter",
    "amount",
    "remaining",
  ]),
  usurp: triggerEventSpec(["object"]),
  crank: triggerEventSpec(["object"]),
  transcend: triggerEventSpec(["object"]),
  create: triggerEventSpec(["created-object"], undefined, undefined, ["amount"]),
  "complete-contract": triggerEventSpec(["object"]),
  trigger: triggerEventSpec(["trigger-source"], undefined, undefined, ["abilityType"]),
  fragment: triggerEventSpec(["object"]),
  equip: triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  "turn-face-up": triggerEventSpec(["object"]),
  activate: triggerEventSpec(["activated-card"], undefined, undefined, ["abilityType"]),
  "beat-chest": triggerEventSpec(["object"], ["object"], ["discarded-cards"], ["amount"]),
  clash: triggerEventSpec([]),
  "move-zone": triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  "crowd-cheers": triggerEventSpec([]),
  protect: triggerEventSpec([]),
  "crowd-boos": triggerEventSpec([]),
  "go-again": triggerEventSpec(["object"]),
  "gain-keyword": triggerEventSpec(["object"], undefined, undefined, ["keyword"]),
  dies: triggerEventSpec(["moved-object"], undefined, undefined, [
    "from",
    "excludeFrom",
    "to",
    "position",
    "faceDown",
    "random",
    "reason",
  ]),
  become: triggerEventSpec(["object"], ["object", "previous-object"]),
  transform: triggerEventSpec(
    ["object", "incoming-object"],
    ["object", "previous-object", "incoming-object"],
    [],
    ["transformPartner"],
  ),
  "gain-life": triggerEventSpec([], [], [], ["amount"]),
  "lose-life": triggerEventSpec([], [], [], ["amount", "source"]),
  opt: triggerEventSpec([], [], [], ["amount"]),
  reveal: triggerEventSpec(["revealed-card"], undefined, undefined, ["amount"]),
  look: triggerEventSpec(["looked-at-card"], undefined, undefined, ["amount"]),
  "modify-power": triggerEventSpec(["modified-object"], undefined, undefined, ["delta"]),
  roll: triggerEventSpec([], [], [], ["sides", "result"]),
} satisfies Record<FabObservableEventName, FabRuntimeTriggerEventSpec>;
const LEGACY_TRIGGER_KEYS = [
  "variant",
  "subject",
  "subjectController",
  "observedObject",
  "binding",
  "phase",
  "combatStep",
  "per",
  "comparison",
  "alone",
  "togetherWith",
  "togetherWithCount",
  "togetherWithEach",
] as const;

function assertValidFabTriggerPrograms(definition: FabCardDefinitionInput): void {
  const abilities = [
    ...(definition.abilities ?? []),
    ...(definition.base?.abilities ?? []),
  ] as readonly unknown[];
  for (const ability of abilities) {
    if (!isRecord(ability)) throw invalidTriggerProgram(definition, "ability is not an object");
    const triggered = ability.kind === "static" && ability.staticKind === "triggered";
    if (triggered) {
      assertTriggerCondition(definition, ability.trigger);
      if (!isRecord(ability.resolution)) {
        throw invalidTriggerProgram(definition, "triggered static ability has no resolution");
      }
    } else if (ability.trigger !== undefined) {
      throw invalidTriggerProgram(
        definition,
        "only staticKind:triggered abilities may own a trigger",
      );
    }
    assertNestedTriggerEffects(definition, ability, 0);
  }
}

function assertNestedTriggerEffects(
  definition: FabCardDefinitionInput,
  value: unknown,
  depth: number,
): void {
  if (depth > 64) throw invalidTriggerProgram(definition, "effect graph exceeds depth limit");
  if (Array.isArray(value)) {
    for (const entry of value) assertNestedTriggerEffects(definition, entry, depth + 1);
    return;
  }
  if (!isRecord(value)) return;
  if (value.type === "delayed-trigger" || value.type === "inline-trigger") {
    assertTriggerCondition(definition, value.trigger);
    if (!isRecord(value.resolution)) {
      throw invalidTriggerProgram(definition, `${value.type} has no typed resolution`);
    }
    if (value.type === "delayed-trigger" && !isRecord(value.policy)) {
      throw invalidTriggerProgram(definition, "delayed-trigger has no typed policy");
    }
    if (value.type === "delayed-trigger" && isRecord(value.policy)) {
      if (value.policy.kind !== "windowed") {
        throw invalidTriggerProgram(definition, "delayed-trigger has an unsupported policy");
      }
      if (!["first", "every"].includes(String(value.policy.matching))) {
        throw invalidTriggerProgram(definition, "windowed delayed-trigger lacks matching policy");
      }
    }
    for (const legacy of ["event", "effect", "duration", "consumeOnUse", "condition"]) {
      if (legacy in value) {
        throw invalidTriggerProgram(definition, `${value.type} contains legacy field ${legacy}`);
      }
    }
  }
  for (const child of Object.values(value))
    assertNestedTriggerEffects(definition, child, depth + 1);
}

function assertTriggerCondition(definition: FabCardDefinitionInput, value: unknown): void {
  if (!isRecord(value) || !["event", "state", "event-and-state"].includes(String(value.kind))) {
    throw invalidTriggerProgram(definition, "trigger condition lacks an explicit kind");
  }
  if (value.kind === "state" || value.kind === "event-and-state") {
    if (!isRecord(value.state))
      throw invalidTriggerProgram(definition, "state trigger lacks state");
  }
  if (value.kind === "event" || value.kind === "event-and-state") {
    if (!isRecord(value.event))
      throw invalidTriggerProgram(definition, "event trigger lacks event");
    const patterns =
      value.event.kind === "any-of"
        ? Array.isArray(value.event.patterns)
          ? value.event.patterns
          : []
        : [value.event];
    if (value.event.kind === "any-of" && patterns.length < 2) {
      throw invalidTriggerProgram(definition, "any-of requires at least two event patterns");
    }
    for (const pattern of patterns) assertTriggerPattern(definition, pattern);
  }
}

function assertTriggerPattern(definition: FabCardDefinitionInput, value: unknown): void {
  if (!isRecord(value) || !FAB_OBSERVABLE_EVENT_NAME_SET.has(String(value.name))) {
    throw invalidTriggerProgram(
      definition,
      `unknown observable event ${String(isRecord(value) ? value.name : value)}`,
    );
  }
  for (const legacy of LEGACY_TRIGGER_KEYS) {
    if (legacy in value)
      throw invalidTriggerProgram(definition, `event pattern contains legacy field ${legacy}`);
  }
  const eventName = String(value.name) as FabObservableEventName;
  const eventSpec = FAB_TRIGGER_EVENT_SPECS[eventName];
  const allowedPatternKeys = new Set([
    "name",
    "actor",
    "observes",
    "during",
    ...eventSpec.constraints,
  ]);
  for (const key of Object.keys(value)) {
    if (!allowedPatternKeys.has(key)) {
      throw invalidTriggerProgram(definition, `${eventName} does not support constraint ${key}`);
    }
  }
  if (!isRecord(value.actor) || !["any", "none", "player"].includes(String(value.actor.kind))) {
    throw invalidTriggerProgram(definition, "event pattern lacks an explicit actor");
  }
  if (value.actor.kind === "player" && typeof value.actor.player !== "string") {
    throw invalidTriggerProgram(definition, "player actor lacks a relative-player relationship");
  }
  if (
    value.actor.kind === "player" &&
    ![
      "ability-controller",
      "opponent",
      "turn-player",
      "non-turn-player",
      "attacking-hero",
      "defending-hero",
      "other-hero",
    ].includes(String(value.actor.player))
  ) {
    throw invalidTriggerProgram(
      definition,
      `unsupported relative player ${String(value.actor.player)}`,
    );
  }
  if (value.during !== undefined) {
    if (!isRecord(value.during) || !["phase", "combat-step"].includes(String(value.during.kind))) {
      throw invalidTriggerProgram(definition, "event timing window is malformed");
    }
    if (
      value.during.kind === "phase" &&
      !["start", "action", "end"].includes(String(value.during.phase))
    ) {
      throw invalidTriggerProgram(definition, `unsupported phase ${String(value.during.phase)}`);
    }
    if (
      value.during.kind === "combat-step" &&
      !["layer", "attack", "defend", "reaction", "damage", "resolution", "close"].includes(
        String(value.during.step),
      )
    ) {
      throw invalidTriggerProgram(
        definition,
        `unsupported combat step ${String(value.during.step)}`,
      );
    }
  }
  if (!isRecord(value.observes)) {
    throw invalidTriggerProgram(definition, "event pattern lacks explicit observation semantics");
  }
  const observationKind = String(value.observes.kind);
  if (
    !["none", "source", "bound-object", "event-object", "event-objects"].includes(observationKind)
  ) {
    throw invalidTriggerProgram(definition, `unsupported observation kind ${observationKind}`);
  }
  if (observationKind !== "none" && typeof value.observes.selector !== "string") {
    throw invalidTriggerProgram(definition, "object observation lacks a selector");
  }
  const selector = String(value.observes.selector);
  const validSelectors =
    observationKind === "source"
      ? eventSpec.source
      : observationKind === "event-objects"
        ? eventSpec.plural
        : observationKind === "none"
          ? []
          : eventSpec.singular;
  if (observationKind !== "none" && !validSelectors.includes(selector)) {
    throw invalidTriggerProgram(
      definition,
      `${eventName} does not expose ${selector} as a ${observationKind} selector`,
    );
  }
  if (
    observationKind === "event-objects" &&
    !["any", "all"].includes(String(value.observes.quantifier))
  ) {
    throw invalidTriggerProgram(definition, "plural observation lacks an any/all quantifier");
  }
  if (
    (observationKind === "event-object" || observationKind === "event-objects") &&
    !isRecord(value.observes.relationship)
  ) {
    throw invalidTriggerProgram(definition, "event-object observation lacks a relationship");
  }
  if (isRecord(value.observes.relationship)) {
    const relationship = value.observes.relationship;
    if (!["any", "controller", "owner", "zone-owner"].includes(String(relationship.kind))) {
      throw invalidTriggerProgram(
        definition,
        `unsupported object relationship ${String(relationship.kind)}`,
      );
    }
    if (
      relationship.kind !== "any" &&
      !["ability-controller", "opponent"].includes(String(relationship.player))
    ) {
      throw invalidTriggerProgram(definition, "object relationship lacks a relative player");
    }
  }
}

function invalidTriggerProgram(definition: FabCardDefinitionInput, reason: string): Error {
  return new Error(`Invalid FAB trigger program on ${definition.canonicalId}: ${reason}.`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertValidFabCardLayout(definition: FabCardDefinitionInput): void {
  const layout = definition.layout;
  if (!layout || layout.kind === "single" || layout.kind === "split") return;
  const expectedPrefix = `${definition.canonicalId}:face:`;
  if (
    layout.front.faceId === layout.back.faceId ||
    !layout.front.faceId.startsWith(expectedPrefix) ||
    !layout.back.faceId.startsWith(expectedPrefix)
  ) {
    throw new Error(
      `FAB paired card ${definition.canonicalId} requires two distinct canonical face ids.`,
    );
  }
}

/** Catalog/initialization diagnostic over immutable normalized base properties. */
export function baseKeywordNames(def: FabRegisteredCardDefinition | undefined): string[] {
  return def?.base.keywords.map((keyword) => keyword.name) ?? [];
}

/** Catalog/initialization diagnostic; rules consumers must use FabRulesView. */
export function baseHasKeyword(def: FabCardDefinitionInput | undefined, name: string): boolean {
  if (!def) return false;
  const registered = registerFabCardDefinition(def);
  if (baseKeywordNames(registered).includes(name)) return true;
  // Label keywords: a small set of CR keywords (Combo 8.4.1, Crush 8.5) are
  // emitted as an ability `label.name` rather than a top-level keyword entry,
  // so "card with combo/crush" must match an ability carrying that label.
  // Other ability labels (intimidate, freeze, transform, …) are effect
  // categories, NOT keywords, and must not satisfy baseHasKeyword.
  if (LABEL_KEYWORD_NAMES.has(name)) {
    for (const ability of registered.base.abilities) {
      if (ability.label?.name === name) return true;
    }
  }
  return false;
}

/** Keyword names that may be carried as an ability `label.name` surface. */
const LABEL_KEYWORD_NAMES: ReadonlySet<string> = new Set([
  "combo",
  "crush",
  "reprise",
  "surge",
  "rupture",
  "high-tide",
  "lightning-flow",
  "earth-bond",
  "ice-bond",
  "lightning-bond",
]);

export function baseHasDefense(def: FabCardDefinitionInput | undefined): boolean {
  return def !== undefined && registerFabCardDefinition(def).base.numeric.defense !== undefined;
}

export function basePitchValue(def: FabRegisteredCardDefinition | undefined): number | undefined {
  return def?.base.numeric.pitch;
}

export function baseCardCost(def: FabRegisteredCardDefinition | undefined): number | undefined {
  return def?.base.numeric.cost;
}

export function baseCardPower(def: FabRegisteredCardDefinition | undefined): number | undefined {
  return def?.base.numeric.power;
}

export function baseCardDefense(def: FabRegisteredCardDefinition | undefined): number | undefined {
  return def?.base.numeric.defense;
}

export const DEFAULT_HERO_INTELLECT = 4;
