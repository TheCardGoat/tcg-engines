import {
  walkAbilityEffects,
  type FleshAndBloodAbility,
  type FleshAndBloodCard,
  type FleshAndBloodCardI18n,
  type FleshAndBloodCardLocaleText,
  type FabResolutionAbility,
} from "@tcg/flesh-and-blood-types";

/**
 * Join locale-owned presentation wording to a rules-only authored card.
 * The executable modules remain text-free; the generated registry calls this
 * once for its default locale before exposing cards to the engine.
 */
export function localizeFleshAndBloodCard(
  card: FleshAndBloodCard,
  i18n: FleshAndBloodCardI18n,
  locale = "en",
): FleshAndBloodCard {
  if (i18n.canonicalId !== card.canonicalId) {
    throw new Error(
      `Card localization ${i18n.canonicalId} does not match structured card ${card.canonicalId}`,
    );
  }
  const text = i18n.locales[locale] ?? i18n.locales.en;
  validateAbilityOverrides(card, text);
  const abilities = card.base.abilities.map((ability) => localizeAbility(card, ability, text));
  const byId = new Map(abilities.map((ability) => [ability.id, ability] as const));
  const layout = localizeLayout(card, text, byId);
  const baseAbilities = card.base.abilities.map(
    (ability) => byId.get(ability.id) ?? localizeAbility(card, ability, text),
  );
  const baseNames: readonly [string, ...string[]] =
    layout.kind === "split"
      ? [layout.faces[0].name, layout.faces[1].name]
      : replacePrimaryName(card.base.names, text.name);
  return {
    ...card,
    layout,
    base: {
      ...card.base,
      names: baseNames,
      abilities: baseAbilities,
    },
  };
}

function localizeLayout(
  card: FleshAndBloodCard,
  locale: FleshAndBloodCardLocaleText,
  byId: ReadonlyMap<string, FleshAndBloodAbility>,
): FleshAndBloodCard["layout"] {
  if (card.layout.kind === "single") return card.layout;
  if (card.layout.kind === "split") {
    const [left, right] = card.layout.faces;
    return {
      ...card.layout,
      faces: [localizeFace(left), localizeFace(right)],
    };

    function localizeFace(face: typeof left): typeof left {
      return {
        ...face,
        abilities: face.abilities.map(
          (ability) => byId.get(ability.id) ?? localizeAbility(card, ability, locale),
        ),
      };
    }
  }
  return {
    ...card.layout,
    front: {
      ...card.layout.front,
      abilities: card.layout.front.abilities.map((ability) =>
        localizeAbility(card, ability, locale),
      ),
    },
    back: {
      ...card.layout.back,
      abilities: card.layout.back.abilities.map((ability) =>
        localizeAbility(card, ability, locale),
      ),
    },
  };
}

function localizeAbility(
  card: FleshAndBloodCard,
  ability: FleshAndBloodAbility,
  locale: FleshAndBloodCardLocaleText,
): FleshAndBloodAbility {
  const path = semanticPath(card.canonicalId, ability.id);
  const override = locale.abilities?.[path];
  if (ability.kind === "resolution") {
    return localizeResolutionAbility(card, ability, locale, override?.text);
  }
  let localized: FleshAndBloodAbility = {
    ...ability,
    text: nonempty(override?.text) ?? nonempty(locale.text) ?? humanizeSemanticKey(path, "Ability"),
    displayName: nonempty(override?.displayName) ?? humanizeSemanticKey(path, "Ability"),
  };

  if (localized.kind === "modal") {
    localized = {
      ...localized,
      modes: localizeModes(card, localized.modes, locale, path, override?.modes),
    };
  } else if (
    localized.kind === "static" &&
    localized.staticKind === "triggered" &&
    localized.resolution.kind === "modal"
  ) {
    localized = {
      ...localized,
      resolution: {
        ...localized.resolution,
        modes: localizeModes(card, localized.resolution.modes, locale, path, override?.modes),
      },
    };
  }

  return walkAbilityEffects(localized, (effect) => {
    if (effect.type !== "grant-property" || effect.property.kind !== "ability") return effect;
    return {
      ...effect,
      property: {
        ...effect.property,
        ability: localizeAbility(card, effect.property.ability, locale),
      },
    };
  });
}

function localizeResolutionAbility(
  card: FleshAndBloodCard,
  ability: FabResolutionAbility,
  locale: FleshAndBloodCardLocaleText,
  textOverride?: string,
): FabResolutionAbility {
  const path = semanticPath(card.canonicalId, ability.id);
  const localized: FabResolutionAbility = {
    ...ability,
    text: nonempty(textOverride) ?? nonempty(locale.text) ?? humanizeSemanticKey(path, "Ability"),
  };
  const walked = walkAbilityEffects(localized, (effect) => {
    if (effect.type !== "grant-property" || effect.property.kind !== "ability") return effect;
    return {
      ...effect,
      property: {
        ...effect.property,
        ability: localizeAbility(card, effect.property.ability, locale),
      },
    };
  });
  if (walked.kind !== "resolution") {
    throw new Error(`Resolution ability ${ability.id} changed kind during localization`);
  }
  return walked;
}

function localizeModes(
  card: FleshAndBloodCard,
  modes: readonly FabResolutionAbility[],
  locale: FleshAndBloodCardLocaleText,
  abilityPath: string,
  overrides: Readonly<Record<string, string>> | undefined,
): readonly FabResolutionAbility[] {
  const modeKeys = new Set(
    modes.map((mode) => semanticTail(semanticPath(card.canonicalId, mode.id))),
  );
  const unknownOverrides = Object.keys(overrides ?? {}).filter((key) => !modeKeys.has(key));
  if (unknownOverrides.length > 0) {
    throw new Error(
      `Unknown localization mode path(s) for ${card.canonicalId}:${abilityPath}: ${unknownOverrides.join(", ")}`,
    );
  }
  const localized: readonly FabResolutionAbility[] = modes.map((mode) => {
    const modePath = semanticPath(card.canonicalId, mode.id);
    const modeKey = semanticTail(modePath);
    const override = overrides?.[modeKey];
    return {
      ...localizeResolutionAbility(card, mode, locale, override),
      text: nonempty(override) ?? humanizeSemanticKey(modeKey, "Mode"),
    };
  });
  const counts = new Map<string, number>();
  for (const mode of localized) counts.set(mode.text, (counts.get(mode.text) ?? 0) + 1);
  return localized.map((mode) => {
    if ((counts.get(mode.text) ?? 0) < 2) return mode;
    const modeKey = semanticTail(semanticPath(card.canonicalId, mode.id));
    return { ...mode, text: `${mode.text} (${abilityPath}:${modeKey})` };
  });
}

function validateAbilityOverrides(
  card: FleshAndBloodCard,
  locale: FleshAndBloodCardLocaleText,
): void {
  const validPaths = new Set<string>();
  const visit = (ability: FleshAndBloodAbility): void => {
    validPaths.add(semanticPath(card.canonicalId, ability.id));
    walkAbilityEffects(ability, (effect) => {
      if (effect.type === "grant-property" && effect.property.kind === "ability") {
        visit(effect.property.ability);
      }
      return effect;
    });
  };
  for (const ability of card.base.abilities) visit(ability);
  if (card.layout.kind === "split") {
    for (const face of card.layout.faces) for (const ability of face.abilities) visit(ability);
  } else if (card.layout.kind !== "single") {
    for (const face of [card.layout.front, card.layout.back]) {
      for (const ability of face.abilities) visit(ability);
    }
  }
  const unknown = Object.keys(locale.abilities ?? {}).filter((path) => !validPaths.has(path));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown localization ability path(s) for ${card.canonicalId}: ${unknown.join(", ")}`,
    );
  }
}

function replacePrimaryName(
  names: readonly string[],
  name: string,
): readonly [string, ...string[]] {
  const [, ...aliases] = names;
  return [name, ...aliases];
}

function semanticPath(canonicalId: string, id: string): string {
  return id.startsWith(`${canonicalId}:`) ? id.slice(canonicalId.length + 1) : id;
}

function semanticTail(path: string): string {
  return path.split(":").at(-1) ?? path;
}

function humanizeSemanticKey(path: string, fallback: string): string {
  const key = semanticTail(path).trim();
  if (!key) return fallback;
  const text = key
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return text ? `${text[0]!.toUpperCase()}${text.slice(1)}` : fallback;
}

function nonempty(value: string | undefined): string | undefined {
  return value?.trim() ? value : undefined;
}
