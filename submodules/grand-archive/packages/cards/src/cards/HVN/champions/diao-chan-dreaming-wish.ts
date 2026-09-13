import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diaoChanDreamingWish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pknaxnn0xo",
  slug: "diao-chan-dreaming-wish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pknaxnn0xo:face:default",
      catalogId: "pknaxnn0xo",
      name: "Diao Chan, Dreaming Wish",
      lineageName: "Diao Chan",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Diao Chan Lineage\n\nInherited Effect — At the beginning of your end phase, if the amount of glimmer counters on Diao Chan is less than the amount of phantasias you control, put an amount of glimmer counters on Diao Chan equal to the difference.",
      abilities: [
        {
          id: "pknaxnn0xo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diao Chan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diao Chan",
          },
        },
        {
          id: "pknaxnn0xo-a2",
          kind: "triggered",
          text: "Inherited Effect — At the beginning of your end phase, if the amount of glimmer counters on Diao Chan is less than the amount of phantasias you control, put an amount of glimmer counters on Diao Chan equal to the difference.",
          executionSource: "lineage-host",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          interveningCondition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "ability-bearer",
                },
                counter: {
                  named: "glimmer",
                },
              },
              operator: "lt",
              right: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "ability-bearer",
            },
            counter: {
              named: "glimmer",
            },
            amount: {
              kind: "calculate",
              operator: "subtract",
              operands: [
                {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["PHANTASIA"],
                    },
                  },
                },
                {
                  kind: "counter-count",
                  subject: {
                    kind: "ability-bearer",
                  },
                  counter: {
                    named: "glimmer",
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

export default diaoChanDreamingWish;
