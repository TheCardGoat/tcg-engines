import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seizeFate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l61ubi93jx",
  slug: "seize-fate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l61ubi93jx:face:default",
      catalogId: "l61ubi93jx",
      name: "Seize Fate",
      cost: {
        kind: "reserve",
        amount: 6,
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
        "[Jin Bonus] This card costs 2 less to activate.\n\nFor the rest of the game, if your champion would take damage, remove that many damage counters from them instead and then if there are zero damage counters on your champion, banish your champion.",
      abilities: [
        {
          id: "l61ubi93jx-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Jin Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "l61ubi93jx-a2",
          kind: "card-resolution",
          text: "For the rest of the game, if your champion would take damage, remove that many damage counters from them instead and then if there are zero damage counters on your champion, banish your champion.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                    amount: {
                      kind: "event-amount",
                    },
                  },
                  {
                    kind: "conditional",
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
                        operator: "eq",
                        right: 0,
                      },
                    },
                    then: {
                      kind: "banish-object",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                    },
                  },
                ],
              },
            },
            duration: {
              kind: "permanent",
            },
          },
        },
      ],
    },
  },
};

export default seizeFate;
