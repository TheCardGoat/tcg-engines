import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conductiveStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dDOMoeCJyK",
  slug: "conductive-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dDOMoeCJyK:face:default",
      catalogId: "dDOMoeCJyK",
      name: "Conductive Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 1,
      },
      rulesText:
        "Conductive Strike gets +XPOWER, where X is the amount of objects you control with one or more static counters on them.\n\n[Class Bonus] On Hit: You may pay (2). If you do, put a static counter on each arcane element object you control.",
      abilities: [
        {
          id: "dDOMoeCJyK-a1",
          kind: "static",
          staticKind: "effects",
          text: "Conductive Strike gets +XPOWER, where X is the amount of objects you control with one or more static counters on them.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "static",
                  },
                },
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
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
        {
          id: "dDOMoeCJyK-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: You may pay (2). If you do, put a static counter on each arcane element object you control.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 2,
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["ARCANE"],
                        },
                      },
                    },
                    counter: "static",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default conductiveStrike;
