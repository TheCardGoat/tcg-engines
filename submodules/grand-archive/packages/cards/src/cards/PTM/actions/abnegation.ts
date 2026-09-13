import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const abnegation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7JjxD8xRVq",
  slug: "abnegation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7JjxD8xRVq:face:default",
      catalogId: "7JjxD8xRVq",
      name: "Abnegation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        'Recover 8+X, where X is twice the amount of Curse cards in your champion\'s lineage.\n\n[Alice Bonus] As long as a card activation you controlled was negated this turn, this card in your graveyard has "Ephemerate — (2)".',
      abilities: [
        {
          id: "7JjxD8xRVq-a1",
          kind: "card-resolution",
          text: "Recover 8+X, where X is twice the amount of Curse cards in your champion's lineage.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      host: {
                        kind: "champion",
                        player: "controller",
                      },
                      relationship: "lineage-of",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  2,
                ],
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                8,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
        {
          id: "7JjxD8xRVq-a2",
          kind: "static",
          staticKind: "effects",
          text: '[Alice Bonus] As long as a card activation you controlled was negated this turn, this card in your graveyard has "Ephemerate — (2)".',
          functionalZones: ["graveyard"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "history",
                event: "stack-item-negated",
                window: "this-turn",
                itemTypes: ["card-activation"],
                stackItemController: "controller",
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ephemerate",
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default abnegation;
