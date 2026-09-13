import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sturdyDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YOk6yLd7M0",
  slug: "sturdy-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YOk6yLd7M0:face:default",
      catalogId: "YOk6yLd7M0",
      name: "Sturdy Droid",
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
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Vigor (At the beginning of your end phase, wake this ally up. Apply this effect only if your champion’s class matches this card’s class.)\n",
      abilities: [
        {
          id: "YOk6yLd7M0-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor (At the beginning of your end phase, wake this ally up. Apply this effect only if your champion’s class matches this card’s class.)",
          keyword: {
            name: "vigor",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default sturdyDroid;
