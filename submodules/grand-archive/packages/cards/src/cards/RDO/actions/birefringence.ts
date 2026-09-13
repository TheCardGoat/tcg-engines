import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const birefringence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wuTQLLq5US",
  slug: "birefringence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wuTQLLq5US:face:default",
      catalogId: "wuTQLLq5US",
      name: "Birefringence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        '[Class Bonus] Target attack card in an intent of a unit you control gains "On Hit: You may have the attacker declare an additional attack. If you do, create a copy of this card in that attacker\'s intent."\n',
      abilities: [
        {
          id: "wuTQLLq5US-a1",
          kind: "card-resolution",
          text: '[Class Bonus] Target attack card in an intent of a unit you control gains "On Hit: You may have the attacker declare an additional attack. If you do, create a copy of this card in that attacker\'s intent."',
          targets: [
            {
              id: "target-attack-card",
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
                zones: ["intent"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ATTACK"],
                },
              },
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
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-attack-card",
            },
            affectedSet: "locked",
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
                id: "granted-1uwobbn-a1",
                kind: "triggered",
                text: "On Hit: You may have the attacker declare an additional attack. If you do, create a copy of this card in that attacker's intent.",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-hit",
                    subject: {
                      kind: "ability-bearer",
                    },
                  },
                },
                effect: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "declare-attack",
                    attacker: {
                      kind: "event-attacker",
                    },
                    additional: true,
                    ifDeclared: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "copy",
                          subject: {
                            kind: "ability-bearer",
                          },
                          copy: "object",
                          bindResultAs: "attack-copy",
                        },
                        {
                          kind: "move",
                          subject: {
                            kind: "bound",
                            binding: "attack-copy",
                          },
                          destination: {
                            zone: "intent",
                            host: {
                              kind: "event-attacker",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default birefringence;
