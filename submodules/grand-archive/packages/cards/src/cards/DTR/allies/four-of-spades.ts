import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fourOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8bolq2y5qp",
  slug: "four-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8bolq2y5qp:face:default",
      catalogId: "8bolq2y5qp",
      name: "Four of Spades",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Cardistry — (4): Draw a card into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "8bolq2y5qp-a1",
          kind: "activated",
          text: "Cardistry — (4): Draw a card into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    4,
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
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default fourOfSpades;
