import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wrathfulSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wjaq7t8vbf",
  slug: "wrathful-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wjaq7t8vbf:face:default",
      catalogId: "wjaq7t8vbf",
      name: "Wrathful Slime",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["EXIA"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Pride 4\n\n[Class Bonus] On Enter: For every five damage counters on your champion, put a buff counter on Wrathful Slime. \n\nAs long as Wrathful Slime has six or more buff counters on it, it has immortality.",
      abilities: [
        {
          id: "wjaq7t8vbf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 4",
          keyword: {
            name: "pride",
            value: 4,
          },
        },
        {
          id: "wjaq7t8vbf-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: For every five damage counters on your champion, put a buff counter on Wrathful Slime.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "repeat",
            count: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                5,
              ],
              rounding: "down",
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
        {
          id: "wjaq7t8vbf-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Wrathful Slime has six or more buff counters on it, it has immortality.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 6,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "immortality",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default wrathfulSlime;
