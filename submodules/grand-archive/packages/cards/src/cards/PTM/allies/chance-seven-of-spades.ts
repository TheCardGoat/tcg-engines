import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chanceSevenOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DKoSnhjX18",
  slug: "chance-seven-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DKoSnhjX18:face:default",
      catalogId: "DKoSnhjX18",
      name: "Chance, Seven of Spades",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        '[Level 1+] This card costs 3 less to activate.\n\nCardistry — (7): Chance gains "Other Suited allies you control get +1 POWER and have vigor." This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.\n',
      abilities: [
        {
          id: "DKoSnhjX18-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] This card costs 3 less to activate.",
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
                  right: 1,
                },
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "DKoSnhjX18-a2",
          kind: "activated",
          text: 'Cardistry — (7): Chance gains "Other Suited allies you control get +1 POWER and have vigor." This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.',
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 7,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
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
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-u7hktg-a1",
                kind: "static",
                staticKind: "effects",
                text: "Other Suited allies you control get +1POWER and have vigor.",
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
                        name: "vigor",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default chanceSevenOfSpades;
