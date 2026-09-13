import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jinZealousMaverick: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5ramr16052",
  slug: "jin-zealous-maverick",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5ramr16052:face:default",
      catalogId: "5ramr16052",
      name: "Jin, Zealous Maverick",
      lineageName: "Jin",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 24,
      },
      rulesText:
        'Jin Lineage (Jin, Zealous Maverick must be leveled from a previous level "Jin" champion.) \n\nOn Enter: Jin\'s next attack this turn gets +1 POWER and has "On Attack: Wake up Jin."',
      abilities: [
        {
          id: "5ramr16052-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Jin Lineage (Jin, Zealous Maverick must be leveled from a previous level "Jin" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Jin",
          },
        },
        {
          id: "5ramr16052-a2",
          kind: "triggered",
          text: 'On Enter: Jin\'s next attack this turn gets +1 POWER and has "On Attack: Wake up Jin."',
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
                    amount: 1,
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
                      id: "granted-15mlfrk-a1",
                      kind: "triggered",
                      text: "On Attack: Wake up Jin.",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "attack-declared",
                          subject: {
                            kind: "source",
                          },
                        },
                      },
                      effect: {
                        kind: "wake",
                        subject: {
                          kind: "source",
                        },
                      },
                    },
                  },
                },
                {
                  kind: "wake",
                  subject: {
                    kind: "source",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default jinZealousMaverick;
