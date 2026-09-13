import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const babySlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "bdPYKwzWt5",
  slug: "baby-slime",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "bdPYKwzWt5:face:default",
      catalogId: "bdPYKwzWt5",
      name: "Baby Slime",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default babySlime;
