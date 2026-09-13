import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galesMare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "flHhosV3nC",
  slug: "gales-mare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "flHhosV3nC:face:default",
      catalogId: "flHhosV3nC",
      name: "Gale's Mare",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default galesMare;
