/** Pure FAB deck-construction rules shared by browser, save, queue and pregame. */
export type FabWeaponAreaIssue =
  /** 8.2.2b — a two-hander must occupy both zones; no other weapon/off-hand may accompany it (except a 2H bow + quiver). */
  | "two-hander-must-be-alone"
  /** 8.2.10b — at most one off-hand. */
  | "too-many-off-hand"
  /** 8.2.15b — at most one quiver. */
  | "too-many-quiver";

export type FabWeaponSeatKind = "1h-weapon" | "2h-weapon" | "off-hand" | "quiver" | "non-weapon";

export interface FabWeaponAreaEntry {
  readonly canonicalId: string;
  readonly seat: FabWeaponSeatKind;
  readonly isBow: boolean;
  readonly perched?: boolean;
}

/**
 * Validate a complete weapon area (the end-state after seating). Assumes the
 * caller has already capped the entry count at 2 (the two-zone physical limit).
 */
export function validateWeaponArea(
  entries: readonly FabWeaponAreaEntry[],
): readonly FabWeaponAreaIssue[] {
  const issues: FabWeaponAreaIssue[] = [];
  const present = entries.filter((entry) => entry.canonicalId);
  const offHands = present.filter((entry) => entry.seat === "off-hand");
  const quivers = present.filter((entry) => entry.seat === "quiver");
  const twoHanders = present.filter((entry) => entry.seat === "2h-weapon");
  if (offHands.length > 1) issues.push("too-many-off-hand");
  if (quivers.length > 1) issues.push("too-many-quiver");

  if (twoHanders.length >= 1 && present.length >= 2) {
    // CR 8.2.15 / 8.3.39: quivers with bows, and Perched with any two-hander.
    const legalCompanion =
      twoHanders.length === 1 &&
      present.length === 2 &&
      present.some(
        (entry) =>
          entry !== twoHanders[0] &&
          (entry.perched || (twoHanders[0]!.isBow && entry.seat === "quiver")),
      );
    if (!legalCompanion) issues.push("two-hander-must-be-alone");
  }
  return issues;
}

/** Canonical storage convention: an effective two-hander occupies weapon1. */
export function resolveFabWeaponLayout<T extends FabWeaponAreaEntry>(layout: {
  readonly weapon1?: T;
  readonly weapon2?: T;
}):
  | { readonly status: "accepted"; readonly layout: { readonly weapon1?: T; readonly weapon2?: T } }
  | { readonly status: "rejected"; readonly issues: readonly FabWeaponAreaIssue[] } {
  const issues = validateWeaponArea(
    [layout.weapon1, layout.weapon2].filter((entry): entry is T => entry !== undefined),
  );
  if (issues.length > 0) return { status: "rejected", issues };
  if (layout.weapon2?.seat === "2h-weapon") {
    return { status: "accepted", layout: { weapon1: layout.weapon2, weapon2: layout.weapon1 } };
  }
  return { status: "accepted", layout };
}

/** Effective weapon facts shared by validation and pregame normalization. */
export function fabWeaponAreaEntry(
  card: FabValidationCard,
  hero?: FabValidationCard,
): FabWeaponAreaEntry {
  return {
    canonicalId: card.canonicalId,
    seat: card.types.includes("Quiver")
      ? "quiver"
      : card.types.includes("Off-Hand")
        ? "off-hand"
        : !card.types.includes("Weapon")
          ? "non-weapon"
          : card.types.includes("2H") &&
              !(hero?.deckbuilding.swordsAsOneHanded && card.types.includes("Sword"))
            ? "2h-weapon"
            : "1h-weapon",
    isBow: card.types.includes("Bow"),
    perched: card.deckbuilding.perched,
  };
}

export type FabPregameFormat = "cc" | "silverAge" | "ll" | "blitz" | "shapeshifter";
export type FabHeroAge = "adult" | "young";
export interface FabFormatRules {
  readonly label: string;
  readonly heroAge: FabHeroAge;
  readonly cardPoolMaximum: number | null;
  readonly deckSize: number;
  readonly exactDeckSize: boolean;
  readonly copyLimit: number | null;
  readonly legendaryLimit: boolean;
  readonly enforceHeroCardPool: boolean;
  readonly eligibleRarities: readonly string[] | null;
  readonly legalityKey: "cc" | "silverAge" | "ll" | "blitz" | null;
}
export const FAB_FORMAT_RULES = {
  cc: {
    label: "Classic Constructed",
    heroAge: "adult",
    cardPoolMaximum: 80,
    deckSize: 60,
    exactDeckSize: false,
    copyLimit: 3,
    legendaryLimit: true,
    enforceHeroCardPool: true,
    eligibleRarities: null,
    legalityKey: "cc",
  },
  silverAge: {
    label: "Silver Age",
    heroAge: "young",
    cardPoolMaximum: 55,
    deckSize: 40,
    exactDeckSize: true,
    copyLimit: 2,
    legendaryLimit: true,
    enforceHeroCardPool: true,
    eligibleRarities: ["B", "C", "R"],
    legalityKey: "silverAge",
  },
  ll: {
    label: "Living Legend",
    heroAge: "adult",
    cardPoolMaximum: 80,
    deckSize: 60,
    exactDeckSize: false,
    copyLimit: 3,
    legendaryLimit: true,
    enforceHeroCardPool: true,
    eligibleRarities: null,
    legalityKey: "ll",
  },
  blitz: {
    label: "Blitz",
    heroAge: "young",
    cardPoolMaximum: 52,
    deckSize: 40,
    exactDeckSize: true,
    copyLimit: 1,
    legendaryLimit: true,
    enforceHeroCardPool: true,
    eligibleRarities: null,
    legalityKey: "blitz",
  },
  shapeshifter: {
    label: "Shapeshifter",
    heroAge: "young",
    cardPoolMaximum: null,
    deckSize: 30,
    exactDeckSize: false,
    copyLimit: null,
    legendaryLimit: false,
    enforceHeroCardPool: false,
    eligibleRarities: null,
    legalityKey: null,
  },
} as const satisfies Readonly<Record<FabPregameFormat, FabFormatRules>>;

/** Authored facts, never inferred from localized display text or card rarity. */
export interface FabDeckbuildingRules {
  readonly names: readonly string[];
  readonly heroMetatypes: readonly string[];
  readonly specializationHeroes: readonly string[];
  readonly essence: readonly string[];
  readonly legendary: boolean;
  readonly unlimited: boolean;
  readonly ephemeral: boolean;
  readonly modular: boolean;
  readonly perched: boolean;
  readonly pairsWith: readonly string[];
  readonly anySpecialization: boolean;
  readonly swordsAsOneHanded: boolean;
  readonly equipRestrictions: readonly { readonly types: readonly string[] }[];
}
export interface FabValidationCard {
  readonly canonicalId: string;
  readonly name: string;
  readonly types: readonly string[];
  readonly supertypeSets: readonly (readonly string[])[];
  readonly identityTypes: readonly string[];
  readonly cardCategory: "hero" | "token" | "deck" | "arena" | "unsupported";
  readonly pitch?: string;
  readonly deckbuilding: FabDeckbuildingRules;
  readonly legalFormats: readonly string[];
  readonly restrictedFormats: readonly string[];
  readonly rarities: readonly string[];
}
export type FabEquipmentSlot = "head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2";
export interface FabValidationEntry {
  readonly canonicalId: string;
  readonly quantity: number;
}
export interface FabValidationSelection {
  readonly deck: readonly FabValidationEntry[];
  readonly equipment: Readonly<Partial<Record<FabEquipmentSlot, string>>>;
}
export type FabValidationCode =
  | "hero_required"
  | "cc_adult_hero"
  | "blitz_young_hero"
  | "cc_minimum"
  | "blitz_size"
  | "pool_size"
  | "silver_age_rarity"
  | "copy_limit"
  | "legendary"
  | "card_pool"
  | "specialization"
  | "format_legal"
  | "unknown-card"
  | "invalid-quantity"
  | "hero-in-card-pool"
  | "mentor-requires-young-hero"
  | "ephemeral"
  | "hero-metatype"
  | "quantity-exceeded"
  | "arena-card-in-deck"
  | "wrong-equipment-slot"
  | "weapon-combination"
  | "equip-restricted"
  | "pairs";
export interface FabValidationIssue {
  readonly code: FabValidationCode;
  readonly message: string;
  readonly canonicalId?: string;
  readonly slot?: FabEquipmentSlot;
}
export type FabValidationRequest = {
  readonly format: FabPregameFormat;
  readonly heroId: string | null;
  readonly entries: readonly FabValidationEntry[];
  readonly cards: Readonly<Record<string, FabValidationCard>>;
} & (
  | { readonly mode: "registered" }
  | { readonly mode: "draft"; readonly deck: readonly FabValidationEntry[] }
  | {
      readonly mode: "selection";
      readonly selection: FabValidationSelection;
      readonly relaxDeckSize?: boolean;
    }
);
const bodySlots = ["head", "chest", "arms", "legs"] as const;
const normalize = (name: string): string =>
  name.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");

/** CR 2.7.3: strip honorifics, and match whole words, including multiword monikers. */
export function fabHeroMatchesMoniker(names: readonly string[], moniker: string): boolean {
  const want = normalize(moniker);
  if (!want) return false;
  return names.some((name) => {
    const have = normalize(name).replace(/^(?:(?:ser|sir|lord|lady|master)\s+)+/, "");
    return have === want || have.startsWith(`${want},`) || have.startsWith(`${want} `);
  });
}
export function fabCardCopyLimit(card: FabValidationCard, format: FabPregameFormat): number {
  const rules: FabFormatRules = FAB_FORMAT_RULES[format];
  if (rules.legendaryLimit && card.deckbuilding.legendary) return 1;
  if (rules.legalityKey && card.restrictedFormats.includes(rules.legalityKey)) return 1;
  return card.deckbuilding.unlimited ? Infinity : (rules.copyLimit ?? Infinity);
}
export function fabCardPoolIssues(
  card: FabValidationCard,
  hero: FabValidationCard,
  format: FabPregameFormat,
): FabValidationIssue[] {
  const issues: FabValidationIssue[] = [];
  const add = (code: FabValidationCode, message: string) =>
    issues.push({ code, message, canonicalId: card.canonicalId });
  const facts = card.deckbuilding;
  const anySpecialization =
    hero.deckbuilding.anySpecialization && facts.specializationHeroes.length > 0;
  if (card.cardCategory === "hero")
    add("hero-in-card-pool", `${card.name} cannot be part of the registered card pool.`);
  if (card.cardCategory === "token" || card.cardCategory === "unsupported" || facts.ephemeral)
    add("ephemeral", `${card.name} cannot be included in the registered card pool.`);
  if (
    facts.specializationHeroes.length &&
    !anySpecialization &&
    !facts.specializationHeroes.some((name) => fabHeroMatchesMoniker(hero.deckbuilding.names, name))
  )
    add(
      "specialization",
      `${card.name} requires ${facts.specializationHeroes.join(" or ")} as the hero.`,
    );
  if (
    facts.heroMetatypes.length &&
    !facts.heroMetatypes.some((name) => fabHeroMatchesMoniker(hero.deckbuilding.names, name))
  )
    add("hero-metatype", `${card.name} requires ${facts.heroMetatypes.join(" or ")} as the hero.`);
  if (FAB_FORMAT_RULES[format].enforceHeroCardPool) {
    const allowed = new Set([...hero.identityTypes, ...hero.deckbuilding.essence]);
    const supertypeSets = card.supertypeSets.length ? card.supertypeSets : [card.identityTypes];
    if (
      !anySpecialization &&
      !supertypeSets.some((set) =>
        set.every((type) => card.identityTypes.includes(type) && allowed.has(type)),
      )
    )
      add("card_pool", `${card.name} is outside ${hero.name}'s card pool.`);
    if (card.types.includes("Mentor") && !hero.types.includes("Young"))
      add("mentor-requires-young-hero", `${card.name} requires a young hero.`);
  }
  return issues;
}

export function fabEquipmentSlots(card: FabValidationCard): readonly FabEquipmentSlot[] {
  if (card.deckbuilding.modular) return bodySlots;
  const body = bodySlots.filter((slot) => card.types.some((type) => normalize(type) === slot));
  if (body.length) return body;
  return card.types.some((type) => ["Weapon", "Off-Hand", "Quiver"].includes(type))
    ? ["weapon1", "weapon2"]
    : [];
}

/** The only validation entrypoint. Modes select lifecycle scope, not alternate rules. */
export function validateFabDeckConstruction(input: FabValidationRequest): {
  readonly valid: boolean;
  readonly issues: readonly FabValidationIssue[];
} {
  const issues: FabValidationIssue[] = [];
  const rules: FabFormatRules = FAB_FORMAT_RULES[input.format];
  const hero = input.heroId ? input.cards[input.heroId] : undefined;
  const add = (
    code: FabValidationCode,
    message: string,
    canonicalId?: string,
    slot?: FabEquipmentSlot,
  ) =>
    issues.push({
      code,
      message,
      ...(canonicalId ? { canonicalId } : {}),
      ...(slot ? { slot } : {}),
    });
  const counts = new Map<string, number>();
  for (const entry of input.entries) {
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0)
      add(
        "invalid-quantity",
        `${entry.canonicalId} must have a positive whole-number quantity.`,
        entry.canonicalId,
      );
    else counts.set(entry.canonicalId, (counts.get(entry.canonicalId) ?? 0) + entry.quantity);
  }
  if (!hero || hero.cardCategory !== "hero") add("hero_required", "Choose exactly one hero.");
  for (const id of counts.keys()) {
    const card = input.cards[id];
    if (!card) add("unknown-card", `Unknown card ${id}.`, id);
    else if (hero) issues.push(...fabCardPoolIssues(card, hero, input.format));
  }
  if (input.mode !== "selection") {
    if (hero && hero.types.includes("Young") !== (rules.heroAge === "young"))
      add(
        rules.heroAge === "young" ? "blitz_young_hero" : "cc_adult_hero",
        `${rules.label} requires a ${rules.heroAge} hero.`,
        hero.canonicalId,
      );
    const total = [...counts.values()].reduce((sum, quantity) => sum + quantity, 0);
    if (rules.cardPoolMaximum !== null && total > rules.cardPoolMaximum)
      add(
        "pool_size",
        `${rules.label} allows at most ${rules.cardPoolMaximum} arena and deck cards.`,
      );
    const copies = new Map<string, { card: FabValidationCard; quantity: number }>();
    for (const id of new Set([...(hero ? [hero.canonicalId] : []), ...counts.keys()])) {
      const card = input.cards[id];
      if (!card) continue;
      if (rules.legalityKey && !card.legalFormats.includes(rules.legalityKey))
        add("format_legal", `${card.name} is not currently legal in ${rules.label}.`, id);
      if (
        rules.eligibleRarities &&
        !card.rarities.some((rarity) => rules.eligibleRarities?.includes(rarity))
      )
        add("silver_age_rarity", `${card.name} has no Basic, Common, or Rare printing.`, id);
      if (id === hero?.canonicalId) continue;
      const identity = `${normalize(card.name)}\0${card.pitch ?? ""}`;
      const previous = copies.get(identity);
      copies.set(identity, { card, quantity: (previous?.quantity ?? 0) + (counts.get(id) ?? 0) });
    }
    for (const { card, quantity } of copies.values()) {
      const limit = fabCardCopyLimit(card, input.format);
      if (quantity > limit)
        add(
          card.deckbuilding.legendary && rules.legendaryLimit ? "legendary" : "copy_limit",
          `${card.name} exceeds the ${limit}-copy limit.`,
          card.canonicalId,
        );
    }
    if (input.mode === "registered") {
      const capacity = [...counts].reduce(
        (sum, [id, quantity]) => sum + (input.cards[id]?.cardCategory === "deck" ? quantity : 0),
        0,
      );
      if (capacity < rules.deckSize)
        add(
          "cc_minimum",
          `${rules.label} requires enough registered deck cards to select ${rules.deckSize}.`,
        );
    }
  }
  const selectedDeck =
    input.mode === "selection" ? input.selection.deck : input.mode === "draft" ? input.deck : null;
  if (selectedDeck) {
    const selectedCounts = new Map<string, number>();
    let total = 0;
    for (const entry of selectedDeck) {
      if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
        add(
          "invalid-quantity",
          `${entry.canonicalId} must have a positive whole-number quantity.`,
          entry.canonicalId,
        );
        continue;
      }
      total += entry.quantity;
      selectedCounts.set(
        entry.canonicalId,
        (selectedCounts.get(entry.canonicalId) ?? 0) + entry.quantity,
      );
      const card = input.cards[entry.canonicalId];
      if (!card) add("unknown-card", `Unknown card ${entry.canonicalId}.`, entry.canonicalId);
      else if (card.cardCategory !== "deck")
        add(
          card.cardCategory === "hero" ? "hero-in-card-pool" : "arena-card-in-deck",
          `${card.name} cannot be shuffled into the starting deck.`,
          entry.canonicalId,
        );
    }
    if (!(input.mode === "selection" && input.relaxDeckSize)) {
      if (rules.exactDeckSize ? total !== rules.deckSize : total < rules.deckSize)
        add(
          rules.exactDeckSize ? "blitz_size" : "cc_minimum",
          `${rules.label} requires ${rules.exactDeckSize ? "exactly" : "at least"} ${rules.deckSize} starting-deck cards.`,
        );
    }
    if (input.mode === "selection") {
      const equipped = Object.entries(input.selection.equipment).flatMap(([slot, id]) =>
        id ? [{ slot, id, card: input.cards[id] }] : [],
      );
      for (const { slot, id, card } of equipped) {
        selectedCounts.set(id, (selectedCounts.get(id) ?? 0) + 1);
        if (!card) {
          add("unknown-card", `Unknown card ${id}.`, id);
          continue;
        }
        if (!fabEquipmentSlots(card).some((allowed) => allowed === slot))
          add("wrong-equipment-slot", `${card.name} cannot be equipped in ${slot}.`, id);
        if (
          hero?.deckbuilding.equipRestrictions.some((restriction) =>
            restriction.types.every((type) => card.types.includes(type)),
          )
        )
          add("equip-restricted", `${hero.name} cannot equip ${card.name}.`, id);
        for (const partner of card.deckbuilding.pairsWith) {
          if (
            !equipped.some(
              (other) =>
                other.id !== id &&
                other.card &&
                [...other.card.deckbuilding.names, ...other.card.types].some(
                  (value) => normalize(value) === normalize(partner),
                ),
            )
          )
            add("pairs", `${card.name} must be equipped with ${partner}.`, id);
        }
      }
      const weapons = equipped
        .filter(({ slot, card }) => card && (slot === "weapon1" || slot === "weapon2"))
        .flatMap(({ card }) => (card ? [card] : []));
      const weaponIssues = validateWeaponArea(
        weapons.map((card) => fabWeaponAreaEntry(card, hero)),
      );
      for (const issue of weaponIssues) {
        switch (issue) {
          case "too-many-off-hand":
            add("weapon-combination", "A player may equip at most one off-hand.");
            break;
          case "too-many-quiver":
            add("weapon-combination", "A player may equip at most one quiver.");
            break;
          case "two-hander-must-be-alone":
            add(
              "weapon-combination",
              "A two-hander must be equipped alone, except with a Perched card or a bow with a quiver.",
            );
            break;
          default: {
            const exhaustive: never = issue;
            return exhaustive;
          }
        }
      }
    }
    for (const [id, quantity] of selectedCounts)
      if (quantity > (counts.get(id) ?? 0))
        add(
          "quantity-exceeded",
          `${id} selects ${quantity} copies, but the card pool contains ${counts.get(id) ?? 0}.`,
          id,
        );
  }
  return { valid: issues.length === 0, issues };
}
