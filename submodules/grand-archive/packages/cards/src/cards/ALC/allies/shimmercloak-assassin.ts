import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shimmercloakAssassin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wklzjmwuir",
  slug: "shimmercloak-assassin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wklzjmwuir:face:default",
      catalogId: "wklzjmwuir",
      name: "Shimmercloak Assassin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "wklzjmwuir-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
      ],
    },
  },
};

export default shimmercloakAssassin;
