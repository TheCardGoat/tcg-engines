import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blitzMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u8m6LuUSSu",
  slug: "blitz-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u8m6LuUSSu:face:default",
      catalogId: "u8m6LuUSSu",
      name: "Blitz Mage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default blitzMage;
