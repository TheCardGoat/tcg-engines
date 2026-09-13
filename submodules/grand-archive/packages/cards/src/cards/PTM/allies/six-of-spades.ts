import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sixOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tdRR5lQHMN",
  slug: "six-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tdRR5lQHMN:face:default",
      catalogId: "tdRR5lQHMN",
      name: "Six of Spades",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "GUARDIAN"],
        subtypes: ["ASSASSIN", "GUARDIAN", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Stealth\n\nCardistry — (6): Six of Spades loses stealth and gets +2 LIFE until end of turn. You may change the target of an attack to Six of Spades. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "tdRR5lQHMN-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "tdRR5lQHMN-a2",
          kind: "activated",
          text: "Cardistry — (6): Six of Spades loses stealth and gets +2 LIFE until end of turn. You may change the target of an attack to Six of Spades. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
          label: {
            name: "Cardistry",
          },
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: {
              kind: "calculate",
              operator: "maximum",
              operands: [
                {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [
                    6,
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      },
                      distinctBy: "reserve-cost",
                    },
                  ],
                },
                0,
              ],
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
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
                      kind: "remove-keyword",
                      keyword: {
                        name: "stealth",
                      },
                    },
                  },
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-turn",
                    },
                    layer: {
                      layer: "E",
                      modifies: "stat",
                      sublayer: "modifier",
                    },
                    change: {
                      kind: "numeric",
                      property: "life",
                      operation: "add",
                      amount: 2,
                    },
                  },
                ],
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "retarget",
                  subject: {
                    kind: "current-attack",
                  },
                  chooser: "controller",
                  newTarget: {
                    kind: "source",
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

export default sixOfSpades;
