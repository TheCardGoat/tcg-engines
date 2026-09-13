import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fledgling: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "oswzpvvog0",
  slug: "fledgling",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "oswzpvvog0:face:default",
      catalogId: "oswzpvvog0",
      name: "Fledgling",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default fledgling;
