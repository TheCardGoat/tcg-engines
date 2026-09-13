import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fourOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NsnBhlVzTV",
  slug: "four-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NsnBhlVzTV:face:default",
      catalogId: "NsnBhlVzTV",
      name: "Four of Diamonds",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Retort 3\n\nCardistry — (4): Reveal up to two Suited cards from your memory. For each card revealed this way, generate a Bolt of Diamonds card and put it into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "NsnBhlVzTV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 3",
          keyword: {
            name: "retort",
            value: 3,
          },
        },
        {
          id: "NsnBhlVzTV-a2",
          kind: "activated",
          text: "Cardistry — (4): Reveal up to two Suited cards from your memory. For each card revealed this way, generate a Bolt of Diamonds card and put it into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
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
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "reveal-selection",
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "generate",
                  card: "Bolt of Diamonds",
                  player: "controller",
                  destination: {
                    zone: "memory",
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

export default fourOfDiamonds;
