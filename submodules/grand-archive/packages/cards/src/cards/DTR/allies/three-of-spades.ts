import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const threeOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o09csnorqv",
  slug: "three-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o09csnorqv:face:default",
      catalogId: "o09csnorqv",
      name: "Three of Spades",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Cardistry — (3): Target Suited ally you control gets +2LIFE until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "o09csnorqv-a1",
          kind: "activated",
          text: "Cardistry — (3): Target Suited ally you control gets +2LIFE until end of turn. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
                    3,
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
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
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
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
        },
      ],
    },
  },
};

export default threeOfSpades;
