import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eightOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d43C0Hk6qH",
  slug: "eight-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d43C0Hk6qH:face:default",
      catalogId: "d43C0Hk6qH",
      name: "Eight of Spades",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "[Level 1+] This card costs 4 less to activate.\n\nCardistry — (8): Wake up Eight of Spades. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "d43C0Hk6qH-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] This card costs 4 less to activate.",
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
              amount: 4,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "d43C0Hk6qH-a2",
          kind: "activated",
          text: "Cardistry — (8): Wake up Eight of Spades. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    8,
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
            kind: "wake",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default eightOfSpades;
