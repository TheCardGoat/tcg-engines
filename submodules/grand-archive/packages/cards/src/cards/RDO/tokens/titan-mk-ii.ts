import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const titanMkIi: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "r79VgzA3W4",
  slug: "titan-mk-ii",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "r79VgzA3W4:face:default",
      catalogId: "r79VgzA3W4",
      name: "Titan Mk II",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText: "Taunt, Vigor",
      abilities: [
        {
          id: "r79VgzA3W4-a1",
          kind: "keyword-group",
          text: "Taunt, Vigor",
          keywords: [
            {
              name: "taunt",
            },
            {
              name: "vigor",
            },
          ],
        },
      ],
    },
  },
};

export default titanMkIi;
