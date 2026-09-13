import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silentFirebrand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vwktc1c3kn",
  slug: "silent-firebrand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vwktc1c3kn:face:default",
      catalogId: "vwktc1c3kn",
      name: "Silent Firebrand",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
      abilities: [
        {
          id: "vwktc1c3kn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 2,
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

export default silentFirebrand;
