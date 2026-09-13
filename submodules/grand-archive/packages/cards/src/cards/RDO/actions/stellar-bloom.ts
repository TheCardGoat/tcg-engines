import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stellarBloom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JFdxtCqdeg",
  slug: "stellar-bloom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JFdxtCqdeg:face:default",
      catalogId: "JFdxtCqdeg",
      name: "Stellar Bloom",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)\n\nGather four times.",
      abilities: [
        {
          id: "JFdxtCqdeg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
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
        {
          id: "JFdxtCqdeg-a2",
          kind: "card-resolution",
          text: "Gather four times.",
          effect: {
            kind: "repeat",
            count: 4,
            effect: {
              kind: "keyword-action",
              action: "gather",
            },
          },
        },
      ],
    },
  },
};

export default stellarBloom;
