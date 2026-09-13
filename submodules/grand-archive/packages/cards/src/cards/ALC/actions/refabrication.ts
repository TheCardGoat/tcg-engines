import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refabrication: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cri23mf3vs",
  slug: "refabrication",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cri23mf3vs:face:default",
      catalogId: "cri23mf3vs",
      name: "Refabrication",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may sacrifice two tokens rather than pay this card's reserve cost. \n\nIf your influence is five or less, draw two cards. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "cri23mf3vs-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may sacrifice two tokens rather than pay this card's reserve cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "token",
                  value: true,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "cri23mf3vs-a2",
          kind: "card-resolution",
          text: "If your influence is five or less, draw two cards. (A player's influence is equal to the total amount of cards in their hand and memory.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
                operator: "lte",
                right: 5,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default refabrication;
