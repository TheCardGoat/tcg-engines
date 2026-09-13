import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const risingTides: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y6q4goxi8a",
  slug: "rising-tides",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y6q4goxi8a:face:default",
      catalogId: "y6q4goxi8a",
      name: "Rising Tides",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 3+] Draw a card into your memory. (Apply this effect only if your champion is level 3 or higher.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "y6q4goxi8a-a1",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 3+] Draw a card into your memory. (Apply this effect only if your champion is level 3 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "y6q4goxi8a-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default risingTides;
