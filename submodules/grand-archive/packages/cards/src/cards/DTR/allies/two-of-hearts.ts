import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const twoOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rufki4o41y",
  slug: "two-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rufki4o41y:face:default",
      catalogId: "rufki4o41y",
      name: "Two of Hearts",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Cardistry — (2): Two of Hearts gets +2POWER until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "rufki4o41y-a1",
          kind: "activated",
          text: "Cardistry — (2): Two of Hearts gets +2POWER until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    2,
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default twoOfHearts;
