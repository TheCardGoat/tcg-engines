import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const giantTortoise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "L0RmNaDzhk",
  slug: "giant-tortoise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "L0RmNaDzhk:face:default",
      catalogId: "L0RmNaDzhk",
      name: "Giant Tortoise",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "TURTLE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 6,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default giantTortoise;
