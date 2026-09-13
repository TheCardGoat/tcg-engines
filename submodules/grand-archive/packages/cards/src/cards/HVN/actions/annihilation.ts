import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const annihilation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pvzvqx16w4",
  slug: "annihilation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pvzvqx16w4:face:default",
      catalogId: "pvzvqx16w4",
      name: "Annihilation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Damage 35+] Fast Activation\n\n[Class Bonus] Deal up to 7 damage to your champion. Destroy all non-champion objects with reserve cost equal to the amount of damage dealt to your champion this way.",
      abilities: [
        {
          id: "pvzvqx16w4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Damage 35+] Fast Activation",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 35,
                },
              },
            },
          ],
        },
        {
          id: "pvzvqx16w4-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Deal up to 7 damage to your champion. Destroy all non-champion objects with reserve cost equal to the amount of damage dealt to your champion this way.",
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
              maximum: 7,
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "destroy",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "eq",
                            right: {
                              kind: "modified-ability-result-amount",
                              metric: "damage-dealt",
                            },
                          },
                        },
                      ],
                    },
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

export default annihilation;
