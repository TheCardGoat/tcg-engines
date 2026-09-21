import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const balefulOblation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oye74ibwo8",
  slug: "baleful-oblation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oye74ibwo8:face:default",
      catalogId: "oye74ibwo8",
      name: "Baleful Oblation",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "[Ciel Bonus] This card costs 2 less to activate.\n\nDeal X damage to all units except for your champion, where X is the lowest reserve cost among your omens.",
      abilities: [
        {
          id: "oye74ibwo8-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "oye74ibwo8-a2",
          kind: "card-resolution",
          text: "Deal X damage to all units except for your champion, where X is the lowest reserve cost among your omens.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "minimum",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
                property: "reserve-cost",
                basis: "base",
                emptyValue: 0,
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "not-subject",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                    },
                  ],
                },
              },
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default balefulOblation;
