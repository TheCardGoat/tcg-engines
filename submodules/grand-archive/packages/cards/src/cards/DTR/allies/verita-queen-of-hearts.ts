import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veritaQueenOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4qc47amgpp",
  slug: "verita-queen-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4qc47amgpp:face:default",
      catalogId: "4qc47amgpp",
      name: "Verita, Queen of Hearts",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "You may banish three or more Suited ally cards with total reserve cost 10 from your graveyard rather than pay this card's reserve cost.\n\nOther Suited allies you control have immortality.\n\nOn Death: Suited allies you control get +1POWER until the end of your next turn.",
      abilities: [
        {
          id: "4qc47amgpp-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may banish three or more Suited ally cards with total reserve cost 10 from your graveyard rather than pay this card's reserve cost.",
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
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "at-least",
                  amount: 3,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
                aggregateConstraint: {
                  property: "reserve-cost",
                  operation: "sum",
                  operator: "eq",
                  value: 10,
                  basis: "base",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4qc47amgpp-a2",
          kind: "static",
          staticKind: "effects",
          text: "Other Suited allies you control have immortality.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["SUITED"],
                          },
                        ],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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
                  name: "immortality",
                },
              },
            },
          ],
        },
        {
          id: "4qc47amgpp-a3",
          kind: "triggered",
          text: "On Death: Suited allies you control get +1POWER until the end of your next turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "until-end-of-next-turn",
              whose: "controller",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default veritaQueenOfHearts;
