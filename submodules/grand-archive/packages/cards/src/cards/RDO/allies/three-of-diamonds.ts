import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const threeOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IZ2IiPsxe9",
  slug: "three-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IZ2IiPsxe9:face:default",
      catalogId: "IZ2IiPsxe9",
      name: "Three of Diamonds",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "GUARDIAN"],
        subtypes: ["CLERIC", "GUARDIAN", "SUITED", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Retort 3\n\nCardistry — (3): Look at the top three cards of your deck. Put one of them into your graveyard and the rest back on top of your deck in any order. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "IZ2IiPsxe9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 3",
          keyword: {
            name: "retort",
            value: 3,
          },
        },
        {
          id: "IZ2IiPsxe9-a2",
          kind: "activated",
          text: "Cardistry — (3): Look at the top three cards of your deck. Put one of them into your graveyard and the rest back on top of your deck in any order. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-at-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "graveyard-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-at-cards",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "graveyard-card",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "graveyard",
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "looked-at-cards",
                  excluding: "graveyard-card",
                },
                from: "main-deck",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                    orderChosenBy: "controller",
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

export default threeOfDiamonds;
