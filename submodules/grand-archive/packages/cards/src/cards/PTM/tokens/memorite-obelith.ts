import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const memoriteObelith: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "fdnlbJm3hr",
  slug: "memorite-obelith",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "fdnlbJm3hr:face:default",
      catalogId: "fdnlbJm3hr",
      name: "Memorite Obelith",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "MEMORITE", "GOLEM"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Memorite Obelith gets +1 POWER and +1 LIFE for each of up to five sheen counters on it.\n\nOn Leave: Put X sheen counters onto your Fractured Memories, where X is the amount of sheen counters that were on Memorite Obelith.",
      abilities: [
        {
          id: "fdnlbJm3hr-a1",
          kind: "static",
          staticKind: "effects",
          text: "Memorite Obelith gets +1 POWER and +1 LIFE for each of up to five sheen counters on it.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: {
                  kind: "calculate",
                  operator: "minimum",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "sheen",
                      },
                    },
                    5,
                  ],
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: {
                  kind: "calculate",
                  operator: "minimum",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "sheen",
                      },
                    },
                    5,
                  ],
                },
              },
            },
          ],
        },
        {
          id: "fdnlbJm3hr-a2",
          kind: "triggered",
          text: "On Leave: Put X sheen counters onto your Fractured Memories, where X is the amount of sheen counters that were on Memorite Obelith.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "mastery",
              player: "controller",
              name: "Fractured Memories",
            },
            counter: {
              named: "sheen",
            },
            amount: {
              kind: "counter-count",
              subject: {
                kind: "event-source",
              },
              counter: {
                named: "sheen",
              },
            },
          },
        },
      ],
    },
  },
};

export default memoriteObelith;
