import {
  defineFleshAndBloodCardUnchecked,
  resolutionAbility,
  typeBoxTokens,
  walkAbilityEffects,
  type AuthoringHasStatusConstraint,
  type FabActivatedAbility,
  type FabCardLayout,
  type FabEffect,
  type FabKeyword,
  type FabModalAbility,
  type FabNonTriggeredStaticAbility,
  type FabResolutionAbility,
  type FabSupertypeSets,
  type FabTriggeredStaticAbility,
  type FabTriggeredResolution,
  type FabTypeBox,
  type FabTypeBoxToken,
  type FleshAndBloodAbility,
  type FleshAndBloodCard,
  type FleshAndBloodCardSource,
  type PitchColor,
  type PitchValue,
  type RulesOnlyAbility,
} from "@tcg/flesh-and-blood-types/authoring";

export type { RulesOnlyAbility } from "@tcg/flesh-and-blood-types/authoring";
export { typeBoxTokens } from "@tcg/flesh-and-blood-types/authoring";

type CatalogNumericIdentity = Pick<
  FleshAndBloodCardSource,
  "arcane" | "cost" | "defense" | "health" | "intelligence" | "power"
>;

/** Catalog-owned executable identity for one canonical object. */
export type CanonicalCardIdentity = CatalogNumericIdentity & {
  readonly canonicalId: string;
  readonly slug: string;
  readonly color?: PitchColor;
  readonly pitch?: PitchValue;
  readonly traits?: readonly string[];
  readonly supertypeSets?: FabSupertypeSets;
} & (
    | { readonly types: readonly FabTypeBoxToken[]; readonly typeBox?: never }
    | { readonly typeBox: FabTypeBox; readonly types?: never }
  );

export type SemanticModalMode = FabEffect | RulesOnlyAbility<FabResolutionAbility>;
export type SemanticModalModeMap = Readonly<Record<string, SemanticModalMode>>;
export type SemanticModalAbility<Modes extends SemanticModalModeMap = SemanticModalModeMap> = Omit<
  RulesOnlyAbility<FabModalAbility>,
  "modes"
> & { readonly modes: Modes };

export function semanticModalAbility<const Modes extends SemanticModalModeMap>(
  ability: Omit<RulesOnlyAbility<FabModalAbility>, "modes"> & { readonly modes: Modes },
): SemanticModalAbility<Modes> {
  return ability;
}

export type SemanticTriggeredModalResolution<
  Modes extends SemanticModalModeMap = SemanticModalModeMap,
> = Omit<Extract<FabTriggeredResolution, { readonly kind: "modal" }>, "modes"> & {
  readonly modes: Modes;
};

/** Keyed authoring boundary for a triggered ability's modal resolution. */
export function semanticTriggeredModalResolution<const Modes extends SemanticModalModeMap>(
  resolution: SemanticTriggeredModalResolution<Modes>,
): SemanticTriggeredModalResolution<Modes> {
  return resolution;
}

type SemanticEffectTriggeredResolution = Extract<
  FabTriggeredResolution,
  { readonly kind: "effect" }
>;

export type SemanticTriggeredStaticAbility<
  Modes extends SemanticModalModeMap = SemanticModalModeMap,
> = Omit<RulesOnlyAbility<FabTriggeredStaticAbility>, "resolution"> & {
  readonly resolution: SemanticEffectTriggeredResolution | SemanticTriggeredModalResolution<Modes>;
};

export type SemanticNonModalAbility =
  | RulesOnlyAbility<FabActivatedAbility>
  | RulesOnlyAbility<FabResolutionAbility>
  | RulesOnlyAbility<FabNonTriggeredStaticAbility>
  | SemanticTriggeredStaticAbility;

export type SemanticAbility = FabEffect | SemanticNonModalAbility | SemanticModalAbility;
export type SemanticAbilityMap = Readonly<Record<string, SemanticAbility>>;

type ModalModeMapOfTriggeredResolution<Resolution> =
  Extract<Resolution, { readonly kind: "modal" }> extends infer ModalResolution
    ? [ModalResolution] extends [never]
      ? Readonly<Record<never, never>>
      : ModalResolution extends { readonly modes: infer Modes extends SemanticModalModeMap }
        ? Modes
        : Readonly<Record<never, never>>
    : never;

type ModalModeMapOf<Ability> = Ability extends {
  readonly kind: "modal";
  readonly modes: infer Modes extends SemanticModalModeMap;
}
  ? Modes
  : Ability extends {
        readonly kind: "static";
        readonly staticKind: "triggered";
        readonly resolution: infer Resolution;
      }
    ? ModalModeMapOfTriggeredResolution<Resolution>
    : Readonly<Record<never, never>>;

export type SemanticLocalizationModeKeysOf<Ability> = Extract<
  keyof ModalModeMapOf<Ability>,
  string
>;

export type SemanticLocalizationAbilityKeys<Abilities extends SemanticAbilityMap> = Extract<
  keyof Abilities,
  string
>;

export type SemanticLocalizationModeKeyMap<
  Abilities extends SemanticAbilityMap,
  AbilityKeys extends string = SemanticLocalizationAbilityKeys<Abilities>,
> = {
  readonly [Key in AbilityKeys]: SemanticLocalizationModeKeysOf<Abilities[Key]>;
};

export type SemanticLocalizationContractFromKeys<
  AbilityKeys extends string,
  ModeKeys extends Readonly<Record<AbilityKeys, string>>,
> = {
  readonly [Key in AbilityKeys]: {
    readonly modeKeys: ModeKeys[Key];
  };
};

export type SemanticLocalizationContract<
  Abilities extends SemanticAbilityMap = Readonly<Record<never, never>>,
> = SemanticLocalizationContractFromKeys<
  SemanticLocalizationAbilityKeys<Abilities>,
  SemanticLocalizationModeKeyMap<Abilities>
>;

export type SemanticLocalizationContractShape = Readonly<
  Record<string, { readonly modeKeys: string }>
>;

const semanticLocalizationContract = Symbol("semanticLocalizationContract");

/** Type-only semantic keys carried by a family definition, never by runtime cards. */
export type SemanticLocalizationContractCarrier<
  Contract extends SemanticLocalizationContractShape = SemanticLocalizationContract,
> = {
  readonly [semanticLocalizationContract]: () => Contract;
};

/** Constructor-only runtime brand that carries semantic localization keys in declarations. */
export function carrySemanticLocalizationContract<
  Contract extends SemanticLocalizationContractShape,
>(): SemanticLocalizationContractCarrier<Contract> {
  return {
    [semanticLocalizationContract]: () => {
      throw new Error("Semantic localization contracts are type-only");
    },
  };
}

export type CardBehaviorOptions<Abilities extends SemanticAbilityMap = SemanticAbilityMap> = {
  readonly keywords?: readonly FabKeyword[];
  readonly layout?: FabCardLayout;
  /** Keys are stable semantic identity, never collector numbers or positions. */
  readonly abilities?: Abilities;
};

export type ExactCardBehaviorOptions<Options extends CardBehaviorOptions> = Options &
  Record<Exclude<keyof Options, keyof CardBehaviorOptions>, never>;

export function defineCard<
  const Abilities extends SemanticAbilityMap = Readonly<Record<never, never>>,
  const Options extends CardBehaviorOptions<Abilities> = CardBehaviorOptions<Abilities>,
>(
  identity: CanonicalCardIdentity,
  options: ExactCardBehaviorOptions<Options> & AuthoringHasStatusConstraint<Abilities>,
): FleshAndBloodCard {
  const abilities = options.abilities
    ? expandSemanticAbilities(identity.canonicalId, options.abilities)
    : [];
  return defineFleshAndBloodCardUnchecked({
    ...identity,
    ...(options.layout ? { layout: options.layout } : {}),
    ...(options.keywords && options.keywords.length > 0 ? { keywords: options.keywords } : {}),
    ...(abilities.length > 0 ? { abilities } : {}),
  });
}

export function expandSemanticAbilities(
  canonicalId: string,
  abilityMap: SemanticAbilityMap,
): readonly FleshAndBloodAbility[] {
  return Object.entries(abilityMap).map(([semanticKey, candidate]) => {
    assertSemanticKey(semanticKey, `${canonicalId} ability`);
    const id = `${canonicalId}:${semanticKey}`;
    if (isSemanticModalAbility(candidate)) {
      const modal = expandSemanticModal(candidate);
      return prepareSemanticAbility(modal.ability, id, modal.modeKeys);
    }
    if (isSemanticNonModalAbility(candidate)) {
      return prepareSemanticAbility(expandSemanticNonModalAbility(candidate), id);
    }
    if (isEffect(candidate)) {
      return prepareSemanticAbility(
        expandSemanticNonModalAbility(resolutionAbility(candidate)),
        id,
      );
    }
    throw new Error(`Unsupported semantic ability ${id}`);
  });
}

export function prepareSemanticAbility(
  ability: FleshAndBloodAbility,
  id: string,
  modeKeys?: readonly string[],
): FleshAndBloodAbility {
  assertRulesOnlyAbilityText(ability, id, modeKeys !== undefined);
  const stamped = stampAbilityIdentity(ability, id, modeKeys);
  return walkAbilityEffects(stamped, (effect) => {
    if (effect.type !== "grant-property" || effect.property.kind !== "ability") return effect;
    const nestedKey = effect.property.ability.id;
    const nestedId = nestedKey.startsWith(`${id}:`)
      ? validateSemanticPath(nestedKey, id, `${id} granted ability`)
      : `${id}:${validateSemanticKey(nestedKey, `${id} granted ability`)}`;
    assertRulesOnlyAbilityText(effect.property.ability, nestedId, false);
    return {
      ...effect,
      property: {
        kind: "ability",
        ability: stampAbilityIdentity(effect.property.ability, nestedId),
      },
    };
  });
}

function isSemanticNonModalAbility(value: SemanticAbility): value is SemanticNonModalAbility {
  return "kind" in value && value.kind !== "modal";
}

function expandSemanticNonModalAbility(ability: SemanticNonModalAbility): FleshAndBloodAbility {
  if (ability.kind === "activated") return { ...ability, id: "", text: "" };
  if (ability.kind === "resolution") return { ...ability, id: "", text: "" };
  if (ability.staticKind !== "triggered") return { ...ability, id: "", text: "" };
  const { resolution, ...base } = ability;
  if (resolution.kind === "effect") {
    return { ...base, id: "", text: "", resolution };
  }
  const expanded = expandSemanticModeMap(resolution.modes);
  return {
    ...base,
    id: "",
    text: "",
    resolution: { ...resolution, modes: expanded.modes },
  };
}

function isEffect(value: SemanticAbility): value is FabEffect {
  return "type" in value;
}

function isSemanticModalAbility(value: SemanticAbility): value is SemanticModalAbility {
  return "kind" in value && value.kind === "modal" && !Array.isArray(value.modes);
}

function expandSemanticModal(ability: SemanticModalAbility): {
  readonly ability: FabModalAbility;
  readonly modeKeys: readonly string[];
} {
  const expanded = expandSemanticModeMap(ability.modes);
  return {
    ability: { ...ability, id: "", text: "", modes: expanded.modes },
    modeKeys: expanded.modeKeys,
  };
}

function expandSemanticModeMap(modes: SemanticModalModeMap): {
  readonly modes: readonly FabResolutionAbility[];
  readonly modeKeys: readonly string[];
} {
  const entries = Object.entries(modes);
  const expandedModes = entries.map(([key, value]) => {
    assertSemanticKey(key, "modal mode");
    const mode: FabResolutionAbility = isResolutionAbility(value)
      ? { ...value, id: "", text: "" }
      : { kind: "resolution", id: "", text: "", effect: value };
    assertRulesOnlyAbilityText(mode, key, false);
    return { ...mode, id: key, text: "" };
  });
  return {
    modes: expandedModes,
    modeKeys: entries.map(([key]) => key),
  };
}

function isResolutionAbility(
  value: SemanticModalMode,
): value is RulesOnlyAbility<FabResolutionAbility> {
  return "kind" in value && value.kind === "resolution";
}

function assertRulesOnlyAbilityText(
  ability: FleshAndBloodAbility,
  id: string,
  keyedModal: boolean,
): void {
  if (typeof ability.text === "string" && ability.text.length > 0) {
    throw new Error(`Authored ability ${id} contains display text; move it to the i18n module`);
  }
  if (
    ability.kind === "modal" &&
    !keyedModal &&
    ability.modes.some((mode) => typeof mode.text === "string" && mode.text.length > 0)
  ) {
    throw new Error(`Authored modal ${id} contains display text; move it to the i18n module`);
  }
}

function assertSemanticKey(key: string, label: string): void {
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(key)) {
    throw new Error(`${label} key must be a non-empty semantic identifier; received ${key}`);
  }
}

function validateSemanticKey(key: string, label: string): string {
  assertSemanticKey(key, label);
  return key;
}

function validateSemanticPath(path: string, prefix: string, label: string): string {
  const suffix = path.slice(prefix.length + 1);
  for (const segment of suffix.split(":")) assertSemanticKey(segment, label);
  return path;
}

function stampAbilityIdentity(
  ability: FleshAndBloodAbility,
  id: string,
  modeKeys?: readonly string[],
): FleshAndBloodAbility {
  if (ability.kind === "modal") {
    if (!modeKeys || modeKeys.length !== ability.modes.length) {
      throw new Error(`Modal ability ${id} must be authored through a keyed semantic mode map`);
    }
    return {
      ...ability,
      id,
      text: "",
      modes: ability.modes.map((mode, index) => ({
        ...mode,
        id: `${id}:${modeKeys[index]}`,
        text: "",
      })),
    };
  }
  if (
    ability.kind === "static" &&
    ability.staticKind === "triggered" &&
    ability.resolution.kind === "modal"
  ) {
    return {
      ...ability,
      id,
      text: "",
      resolution: {
        ...ability.resolution,
        modes: ability.resolution.modes.map((mode) => ({
          ...mode,
          id: `${id}:${mode.id}`,
          text: "",
        })),
      },
    };
  }
  return { ...ability, id, text: "" };
}
