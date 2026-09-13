import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fiveOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i9hf5lhl5f",
  slug: "five-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i9hf5lhl5f:face:default",
      catalogId: "i9hf5lhl5f",
      name: "Five of Spades",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SUITED", "ANIMAL", "BEAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Cardistry — (5): Five of Spades gets +5POWER until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.\n\nFloating Memory",
      abilities: [
        {
          id: "i9hf5lhl5f-a1",
          kind: "activated",
          text: "Cardistry — (5): Five of Spades gets +5POWER until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    5,
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
              property: "power",
              operation: "add",
              amount: 5,
            },
          },
        },
        {
          id: "i9hf5lhl5f-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default fiveOfSpades;
