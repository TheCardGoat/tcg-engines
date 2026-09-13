import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const banditGazeLeader: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Yuj8xCUejq",
  slug: "bandit-gaze-leader",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Yuj8xCUejq:face:default",
      catalogId: "Yuj8xCUejq",
      name: "Bandit, Gaze Leader",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        'On Enter: Scavenge 6 for a Raccoon ally card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)\n\nRaccoon allies you control have "REST: Banish target card in a graveyard."',
      abilities: [
        {
          id: "Yuj8xCUejq-a1",
          kind: "triggered",
          text: "On Enter: Scavenge 6 for a Raccoon ally card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "subtype",
                  oneOf: ["RACCOON"],
                },
              ],
            },
          },
        },
        {
          id: "Yuj8xCUejq-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Raccoon allies you control have "REST: Banish target card in a graveyard."',
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
                        kind: "subtype",
                        oneOf: ["RACCOON"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-qxrgpa-a1",
                  kind: "activated",
                  text: "REST: Banish target card in a graveyard.",
                  activation: "ability",
                  cost: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  targets: [
                    {
                      id: "target-card",
                      kind: "target",
                      declared: "announcement",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                      },
                    },
                  ],
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "bound",
                      binding: "target-card",
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default banditGazeLeader;
