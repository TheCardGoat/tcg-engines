import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inzaliUnshackledBlaze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ot4nmxqsm4",
  slug: "inzali-unshackled-blaze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ot4nmxqsm4:face:default",
      catalogId: "ot4nmxqsm4",
      name: "Inzali, Unshackled Blaze",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, deal 1 damage to each other unit. \n\n[Level 3+] [Memory 4+] Inzali gets +2 POWER.",
      abilities: [
        {
          id: "ot4nmxqsm4-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, deal 1 damage to each other unit.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
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
                              kind: "not-source",
                            },
                          ],
                        },
                      },
                    },
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "ot4nmxqsm4-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] [Memory 4+] Inzali gets +2 POWER.",
          restrictions: [
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
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default inzaliUnshackledBlaze;
