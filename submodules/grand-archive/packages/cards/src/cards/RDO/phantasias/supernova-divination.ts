import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const supernovaDivination: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qhBecpDUO9",
  slug: "supernova-divination",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qhBecpDUO9:face:default",
      catalogId: "qhBecpDUO9",
      name: "Supernova Divination",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ULTIMATE", "SPELL"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Spellshroud\n\n[Arisanna Bonus] At the beginning of each player's recollection phase and whenever you starcall a card, put a divination counter on Supernova Divination. Then if there are ten divination counters on Supernova Divination, sacrifice it. If you do, all units you don't control lose all abilities until end of turn. Then deal 25 unpreventable damage to each of them.",
      abilities: [
        {
          id: "qhBecpDUO9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "qhBecpDUO9-a2",
          kind: "triggered",
          text: "[Arisanna Bonus] At the beginning of each player's recollection phase and whenever you starcall a card, put a divination counter on Supernova Divination. Then if there are ten divination counters on Supernova Divination, sacrifice it. If you do, all units you don't control lose all abilities until end of turn. Then deal 25 unpreventable damage to each of them.",
          trigger: {
            kind: "event",
            event: {
              anyOf: [
                {
                  name: "phase-begins",
                  phase: "recollection",
                },
                {
                  name: "card-activated",
                  actor: "controller",
                  activationState: "starcalled",
                  isCopy: false,
                },
              ],
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "divination",
                },
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "has-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "divination",
                  },
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "divination",
                      },
                    },
                    operator: "eq",
                    right: 10,
                  },
                },
                then: {
                  kind: "reflexive",
                  action: {
                    kind: "sacrifice",
                    subject: {
                      kind: "source",
                    },
                  },
                  consequence: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "each",
                          collection: {
                            zones: ["field"],
                            player: "each-opponent",
                            filter: {
                              kind: "type",
                              oneOf: ["ALLY", "CHAMPION"],
                            },
                          },
                        },
                        affectedSet: "locked",
                        duration: {
                          kind: "this-turn",
                        },
                        layer: {
                          layer: "D",
                          modifies: "ability",
                        },
                        change: {
                          kind: "remove-abilities",
                        },
                      },
                      {
                        kind: "deal-damage",
                        source: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "each",
                          collection: {
                            zones: ["field"],
                            player: "each-opponent",
                            filter: {
                              kind: "type",
                              oneOf: ["ALLY", "CHAMPION"],
                            },
                          },
                        },
                        amount: 25,
                        preventable: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default supernovaDivination;
