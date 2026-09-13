import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tomeOfAbyssalHeaven: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "igmC01eEZn",
  slug: "tome-of-abyssal-heaven",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "igmC01eEZn:face:default",
      catalogId: "igmC01eEZn",
      name: "Tome of Abyssal Heaven",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BOOK"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "Tome of Abyssal Heaven enters the field with X page counters on it, where X is the amount of damage counters on your champion.\n\nOther objects you control have spellshroud.\n\nAt the beginning of your recollection phase, remove eight page counters from Tome of Abyssal Heaven. If you do, draw a card. If you don't, you lose the game.",
      abilities: [
        {
          id: "igmC01eEZn-a1",
          kind: "static",
          staticKind: "effects",
          text: "Tome of Abyssal Heaven enters the field with X page counters on it, where X is the amount of damage counters on your champion.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: {
                      named: "page",
                    },
                    amount: {
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "igmC01eEZn-a2",
          kind: "static",
          staticKind: "effects",
          text: "Other objects you control have spellshroud.",
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
                        filters: [],
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
                  name: "spellshroud",
                },
              },
            },
          ],
        },
        {
          id: "igmC01eEZn-a3",
          kind: "triggered",
          text: "At the beginning of your recollection phase, remove eight page counters from Tome of Abyssal Heaven. If you do, draw a card. If you don't, you lose the game.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "remove-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "page",
                  },
                  amount: 8,
                  bindResultAs: "removed-counters",
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
                else: {
                  kind: "lose-game",
                  player: "controller",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tomeOfAbyssalHeaven;
