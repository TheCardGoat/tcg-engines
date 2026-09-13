import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainingSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b0qlk9j6le",
  slug: "training-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b0qlk9j6le:face:default",
      catalogId: "b0qlk9j6le",
      name: "Training Sword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default trainingSword;
