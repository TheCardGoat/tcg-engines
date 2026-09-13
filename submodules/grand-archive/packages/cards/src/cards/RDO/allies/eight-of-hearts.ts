import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eightOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YGz8gN8M69",
  slug: "eight-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YGz8gN8M69:face:default",
      catalogId: "YGz8gN8M69",
      name: "Eight of Hearts",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "While paying for this card's reserve cost, you may sacrifice up to two Suited allies with reserve cost 4 or less. Each ally sacrificed this way pays for 3 of that cost.\n\nCardistry — (8): Draw two cards. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "YGz8gN8M69-a1",
          kind: "static",
          staticKind: "effects",
          text: "While paying for this card's reserve cost, you may sacrifice up to two Suited allies with reserve cost 4 or less. Each ally sacrificed this way pays for 3 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "reserve-cost",
                          basis: "base",
                        },
                        operator: "lte",
                        right: 4,
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
              },
              amount: 3,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "YGz8gN8M69-a2",
          kind: "activated",
          text: "Cardistry — (8): Draw two cards. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default eightOfHearts;
