import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const underFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5sw9f8uqrp",
  slug: "under-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5sw9f8uqrp:face:default",
      catalogId: "5sw9f8uqrp",
      name: "Under Fire",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nYour champion becomes distant. Then you may have Under Fire deal 4 damage to your champion. If you do, your champion gains stealth until end of turn.",
      abilities: [
        {
          id: "5sw9f8uqrp-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5sw9f8uqrp-a2",
          kind: "card-resolution",
          text: "Your champion becomes distant. Then you may have Under Fire deal 4 damage to your champion. If you do, your champion gains stealth until end of turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
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
                      amount: 4,
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "champion",
                        player: "controller",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "this-turn",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "grant-keyword",
                        keyword: {
                          name: "stealth",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default underFire;
