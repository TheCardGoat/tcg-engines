import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgeProtector: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qigcom2ry2",
  slug: "surge-protector",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qigcom2ry2:face:default",
      catalogId: "qigcom2ry2",
      name: "Surge Protector",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, target Shield item you control gains “If damage would be dealt to your champion, prevent that damage and sacrifice this object instead.”",
      abilities: [
        {
          id: "qigcom2ry2-a1",
          kind: "card-resolution",
          text: "Until end of turn, target Shield item you control gains “If damage would be dealt to your champion, prevent that damage and sacrifice this object instead.”",
          targets: [
            {
              id: "target-shield",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SHIELD"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-shield",
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
              kind: "grant-ability",
              ability: {
                id: "granted-ff8b0h-a1",
                kind: "static",
                staticKind: "effects",
                text: "If damage would be dealt to your champion, prevent that damage and sacrifice this object instead.",
                effects: [
                  {
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
                      kind: "sequence",
                      operations: [
                        {
                          kind: "prevent",
                          amount: {
                            kind: "event-amount",
                          },
                        },
                        {
                          kind: "perform-before-commit",
                          effect: {
                            kind: "sacrifice",
                            subject: {
                              kind: "ability-bearer",
                            },
                          },
                        },
                      ],
                    },
                    duration: {
                      kind: "while-source-in-functional-zone",
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
};

export default surgeProtector;
