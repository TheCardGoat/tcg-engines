import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const curtainOfShadows: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y7AFl2B1B3",
  slug: "curtain-of-shadows",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y7AFl2B1B3:face:default",
      catalogId: "y7AFl2B1B3",
      name: "Curtain of Shadows",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ULTIMATE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        '[Tristan Bonus] Summon X Ominous Shadow tokens where X is the amount of preparation counters on your champion.\n\nFor the rest of the game, allies named Ominous Shadow you control get +1POWER and have "On Hit: Put a preparation counter on your champion."',
      abilities: [
        {
          id: "y7AFl2B1B3-a1",
          kind: "card-resolution",
          text: "[Tristan Bonus] Summon X Ominous Shadow tokens where X is the amount of preparation counters on your champion.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "summon",
            controller: "controller",
            object: "Ominous Shadow",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "y7AFl2B1B3-a2",
          kind: "card-resolution",
          text: 'For the rest of the game, allies named Ominous Shadow you control get +1POWER and have "On Hit: Put a preparation counter on your champion."',
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
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
                          kind: "name",
                          value: "Ominous Shadow",
                        },
                      ],
                    },
                  },
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "permanent",
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
                  amount: 1,
                },
              },
              {
                kind: "continuous",
                subjects: {
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
                          kind: "name",
                          value: "Ominous Shadow",
                        },
                      ],
                    },
                  },
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-1egvpy1-a1",
                    kind: "triggered",
                    text: "On Hit: Put a preparation counter on your champion.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "attack-hit",
                        subject: {
                          kind: "source",
                        },
                      },
                    },
                    effect: {
                      kind: "add-counter",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "preparation",
                      amount: 1,
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

export default curtainOfShadows;
