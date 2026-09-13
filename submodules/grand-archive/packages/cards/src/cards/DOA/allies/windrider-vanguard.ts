import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windriderVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JEOxGQppTE",
  slug: "windrider-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JEOxGQppTE:face:default",
      catalogId: "JEOxGQppTE",
      name: "Windrider Vanguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "JEOxGQppTE-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)",
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

export default windriderVanguard;
