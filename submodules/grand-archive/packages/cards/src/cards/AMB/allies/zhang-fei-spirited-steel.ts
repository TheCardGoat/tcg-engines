import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhangFeiSpiritedSteel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qxnv0jqeym",
  slug: "zhang-fei-spirited-steel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qxnv0jqeym:face:default",
      catalogId: "qxnv0jqeym",
      name: "Zhang Fei, Spirited Steel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase.)\n\n[Class Bonus] At the beginning of your end phase, if Zhang Fei is the only ally you control, put a buff counter on Zhang Fei.",
      abilities: [
        {
          id: "qxnv0jqeym-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase.)",
          keyword: {
            name: "vigor",
          },
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
        },
        {
          id: "qxnv0jqeym-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, if Zhang Fei is the only ally you control, put a buff counter on Zhang Fei.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
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
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                operator: "eq",
                right: 1,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default zhangFeiSpiritedSteel;
