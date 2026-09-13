import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lunarSeer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qjt0ooffy4",
  slug: "lunar-seer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qjt0ooffy4:face:default",
      catalogId: "qjt0ooffy4",
      name: "Lunar Seer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Starcalling — (1) (As you’re looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you’re looking at on the bottom of your deck in any order.)\n\n[Class Bonus] REST: Glimpse 2.",
      abilities: [
        {
          id: "qjt0ooffy4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (1) (As you’re looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you’re looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
        },
        {
          id: "qjt0ooffy4-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Glimpse 2.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default lunarSeer;
