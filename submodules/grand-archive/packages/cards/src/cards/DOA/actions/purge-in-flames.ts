import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purgeInFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uTBsOYf15p",
  slug: "purge-in-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uTBsOYf15p:face:default",
      catalogId: "uTBsOYf15p",
      name: "Purge in Flames",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nDeal 2 damage to all units except for your champion. Class Bonus: Deal 3 damage to those units instead. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "uTBsOYf15p-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "uTBsOYf15p-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to all units except for your champion. Class Bonus: Deal 3 damage to those units instead. (Apply the additional effect only if your champion's class matches this card's class.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
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
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-subject",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                      },
                    ],
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
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-subject",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                      },
                    ],
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

export default purgeInFlames;
