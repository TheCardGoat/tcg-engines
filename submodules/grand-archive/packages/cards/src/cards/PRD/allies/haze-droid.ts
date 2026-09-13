import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hazeDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nWAMmtAEM7",
  slug: "haze-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nWAMmtAEM7:face:default",
      catalogId: "nWAMmtAEM7",
      name: "Haze Droid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "nWAMmtAEM7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
      ],
    },
  },
};

export default hazeDroid;
