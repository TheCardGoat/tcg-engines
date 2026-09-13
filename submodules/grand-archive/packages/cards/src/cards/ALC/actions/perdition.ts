import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perdition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nlf619svrr",
  slug: "perdition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nlf619svrr:face:default",
      catalogId: "nlf619svrr",
      name: "Perdition",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        '[Class Bonus] This card costs 2 less to activate.\n\nEach ally target opponent controls gains "On Death: Deal 1 damage to each unit you control" until end of turn. Then deal 1 damage to each ally that opponent controls.',
      abilities: [
        {
          id: "nlf619svrr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nlf619svrr-a2",
          kind: "card-resolution",
          text: 'Each ally target opponent controls gains "On Death: Deal 1 damage to each unit you control" until end of turn. Then deal 1 damage to each ally that opponent controls.',
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: {
                      binding: "target-opponent",
                    },
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
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
                    id: "granted-6nz9t8-a1",
                    kind: "triggered",
                    text: "On Death: Deal 1 damage to each unit you control.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "object-died",
                        subject: {
                          kind: "ability-bearer",
                        },
                      },
                    },
                    effect: {
                      kind: "deal-damage",
                      source: {
                        kind: "ability-bearer",
                      },
                      recipient: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                        },
                      },
                      amount: 1,
                    },
                  },
                },
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: {
                      binding: "target-opponent",
                    },
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default perdition;
