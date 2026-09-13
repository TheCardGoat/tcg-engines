import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const woodlandSquirrels: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6W5AJwF3Y3",
  slug: "woodland-squirrels",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6W5AJwF3Y3:face:default",
      catalogId: "6W5AJwF3Y3",
      name: "Woodland Squirrels",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SQUIRREL"],
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

export default woodlandSquirrels;
