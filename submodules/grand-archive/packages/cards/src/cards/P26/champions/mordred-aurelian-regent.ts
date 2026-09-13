import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mordredAurelianRegent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XPl2UAO9se",
  slug: "mordred-aurelian-regent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XPl2UAO9se:face:default",
      catalogId: "XPl2UAO9se",
      name: "Mordred, Aurelian Regent",
      lineageName: "Mordred",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        'Mordred Lineage\n\nOn Enter: Mordred\'s next attack this turn gets +3POWER and gains "On Hit: Recover 3."\n\nWhenever you activate a luxem element card, delevel Mordred.\n\n',
      abilities: [
        {
          id: "XPl2UAO9se-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Mordred Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Mordred",
          },
        },
        {
          id: "XPl2UAO9se-a2",
          kind: "triggered",
          text: 'On Enter: Mordred\'s next attack this turn gets +3POWER and gains "On Hit: Recover 3."',
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
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "source",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                    amount: 3,
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-32flae-a1",
                      kind: "triggered",
                      text: "On Hit: Recover 3.",
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
                        kind: "recover",
                        player: "controller",
                        amount: 3,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "XPl2UAO9se-a3",
          kind: "triggered",
          text: "Whenever you activate a luxem element card, delevel Mordred.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["LUXEM"],
                },
              },
            },
          },
          effect: {
            kind: "delevel",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default mordredAurelianRegent;
