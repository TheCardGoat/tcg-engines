import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fiveOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "idq4ih00rq",
  slug: "five-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "idq4ih00rq:face:default",
      catalogId: "idq4ih00rq",
      name: "Five of Hearts",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SUITED", "ANIMAL", "RHINO"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Hindered (This ally enters the field rested.)\n\nCardistry — (5): Put a buff counter on each Suited ally you control. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "idq4ih00rq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "idq4ih00rq-a2",
          kind: "activated",
          text: "Cardistry — (5): Put a buff counter on each Suited ally you control. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
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
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default fiveOfHearts;
