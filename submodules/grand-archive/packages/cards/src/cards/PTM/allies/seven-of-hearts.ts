import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sevenOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nduIoPhZr1",
  slug: "seven-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nduIoPhZr1:face:default",
      catalogId: "nduIoPhZr1",
      name: "Seven of Hearts",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE", "WARRIOR"],
        subtypes: ["MAGE", "WARRIOR", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Kindle 7\n\nCardistry — (7): Deal 2 damage to each unit target opponent controls. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "nduIoPhZr1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 7",
          keyword: {
            name: "kindle",
            value: 7,
          },
        },
        {
          id: "nduIoPhZr1-a2",
          kind: "activated",
          text: "Cardistry — (7): Deal 2 damage to each unit target opponent controls. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    7,
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default sevenOfHearts;
