import { describe, expect, it } from "vitest";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import { FAB_TALENT_SUPERTYPES, type FabSupertype } from "@tcg/flesh-and-blood-types";

import { basePropertiesOf, toFabCardDefinition, type FabCardDefinitionInput } from "./cards.ts";
import {
  fabHeroDeckbuildingAccess,
  validateFabPregameSelection,
  type FabPregameCardPool,
} from "./pregame.ts";

const structuredDefinitions = new Map(
  [...fleshAndBloodStructuredCardsByCanonicalId].map(([canonicalId, card]) => [
    canonicalId,
    toFabCardDefinition(card),
  ]),
);

function isElementalHero(definition: FabCardDefinitionInput): boolean {
  const typeBox = basePropertiesOf(toFabCardDefinition(definition)).typeBox;
  return typeBox.types.includes("Hero") && typeBox.supertypes.includes("Elemental");
}

function essenceSupertypes(definition: FabCardDefinitionInput): readonly FabSupertype[] {
  return basePropertiesOf(toFabCardDefinition(definition)).keywords.flatMap((keyword) =>
    keyword.name === "essence" ? keyword.supertypes : [],
  );
}

function talentRepresentative(talent: FabSupertype): FabCardDefinitionInput {
  const representative = [...structuredDefinitions.values()].find((definition) => {
    const properties = basePropertiesOf(toFabCardDefinition(definition));
    return (
      !properties.typeBox.types.includes("Hero") &&
      !properties.typeBox.types.includes("Token") &&
      properties.typeBox.supertypes.length === 1 &&
      properties.typeBox.supertypes[0] === talent &&
      !properties.keywords.some((keyword) => keyword.name === "specialization")
    );
  });
  if (!representative) throw new Error(`No authored ${talent} card is available for pregame QA.`);
  return representative;
}

function validatePool(hero: FabCardDefinitionInput, entries: readonly FabCardDefinitionInput[]) {
  const cardDefinitions = Object.fromEntries(
    [hero, ...entries].map((definition) => [definition.canonicalId, definition]),
  );
  const pool: FabPregameCardPool = {
    format: "cc",
    heroId: hero.canonicalId,
    cardDefinitions,
    entries: entries.map((definition) => ({
      canonicalId: definition.canonicalId,
      quantity: 1,
      source: "main" as const,
    })),
  };
  return validateFabPregameSelection(pool, { equipment: {}, deck: [] }, { relaxDeckSize: true });
}

describe("FAB Elemental hero card-pool legality (CR 1.1.3, 2.11, 8.3.16)", () => {
  it("models every authored Elemental hero with its printed Essence exactly once", () => {
    const structuredHeroes = [...structuredDefinitions.values()].filter(isElementalHero);

    expect(structuredHeroes.length).toBeGreaterThan(0);
    expect(new Set(structuredHeroes.map((hero) => hero.canonicalId)).size).toBe(
      structuredHeroes.length,
    );

    for (const hero of structuredHeroes) {
      const keywords = basePropertiesOf(toFabCardDefinition(hero)).keywords.filter(
        (keyword) => keyword.name === "essence",
      );
      const signatures = keywords.map((keyword) => [...keyword.supertypes].sort().join("|"));
      expect(keywords, hero.base.names[0] ?? hero.canonicalId).toHaveLength(1);
      expect(new Set(signatures).size, hero.base.names[0] ?? hero.canonicalId).toBe(
        signatures.length,
      );
    }
  });

  it("accepts every talent granted by every authored Essence hero", () => {
    const heroes = [...structuredDefinitions.values()].filter(
      (definition) => essenceSupertypes(definition).length > 0,
    );

    for (const hero of heroes) {
      const representatives = essenceSupertypes(hero).map(talentRepresentative);
      const validation = validatePool(hero, representatives);
      expect(
        validation.issues.filter((issue) => issue.code === "hero-supertype-mismatch"),
        hero.base.names[0] ?? hero.canonicalId,
      ).toEqual([]);
    }
  });

  it("keeps Elemental separate and rejects talents the hero was not granted", () => {
    const heroes = [...structuredDefinitions.values()].filter(isElementalHero);

    for (const hero of heroes) {
      const access = fabHeroDeckbuildingAccess(hero);
      const ungrantedTalent = FAB_TALENT_SUPERTYPES.find(
        (talent) => !access.effectiveSupertypes.includes(talent),
      );
      expect(ungrantedTalent, hero.base.names[0] ?? hero.canonicalId).toBeDefined();
      if (!ungrantedTalent) continue;

      const representative = talentRepresentative(ungrantedTalent);
      const validation = validatePool(hero, [representative]);
      expect(validation.issues).toContainEqual(
        expect.objectContaining({
          code: "hero-supertype-mismatch",
          canonicalId: representative.canonicalId,
        }),
      );
    }
  });
});
