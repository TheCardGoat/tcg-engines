import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tsunamiOfNanyue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pi9ftq3sul",
  slug: "tsunami-of-nanyue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pi9ftq3sul:face:default",
      catalogId: "pi9ftq3sul",
      name: "Tsunami of Nanyue",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nDeal 2 damage to all rested allies. If your Shifting Currents face South, deal 3 damage to all rested allies you don't control instead.",
      abilities: [
        {
          id: "pi9ftq3sul-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "pi9ftq3sul-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to all rested allies. If your Shifting Currents face South, deal 3 damage to all rested allies you don't control instead.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "South",
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "object-state",
                    state: "rested",
                  },
                },
              },
              amount: 3,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "object-state",
                    state: "rested",
                  },
                },
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default tsunamiOfNanyue;
