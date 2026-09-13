import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const powerforgedBurst: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OWnWJNstCO",
  slug: "powerforged-burst",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OWnWJNstCO:face:default",
      catalogId: "OWnWJNstCO",
      name: "Powerforged Burst",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice X Powercell items. X can't be more than 3.\n\nDeal 2 damage to target unit X times. If X is 3, draw a card into your memory.",
      abilities: [
        {
          id: "OWnWJNstCO-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice X Powercell items. X can't be more than 3.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POWERCELL"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "OWnWJNstCO-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit X times. If X is 3, draw a card into your memory.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "repeat",
                count: {
                  kind: "variable",
                  symbol: "X",
                },
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 2,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "variable",
                      symbol: "X",
                    },
                    operator: "eq",
                    right: 3,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default powerforgedBurst;
