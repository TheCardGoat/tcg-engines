import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perfusiveEnvelopment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rRfRKqCBqF",
  slug: "perfusive-envelopment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rRfRKqCBqF:face:default",
      catalogId: "rRfRKqCBqF",
      name: "Perfusive Envelopment",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "Perfusive Envelopment enters the field with a blood counter on it.\n\nWhenever a player sacrifices an ally, put a blood counter on Perfusive Envelopment.\n\nAt the beginning of your recollection phase, recover X, where X is the amount of blood counters on Perfusive Envelopment.",
      abilities: [
        {
          id: "rRfRKqCBqF-a1",
          kind: "static",
          staticKind: "effects",
          text: "Perfusive Envelopment enters the field with a blood counter on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: {
                      named: "blood",
                    },
                    amount: 1,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rRfRKqCBqF-a2",
          kind: "triggered",
          text: "Whenever a player sacrifices an ally, put a blood counter on Perfusive Envelopment.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "blood",
            },
            amount: 1,
          },
        },
        {
          id: "rRfRKqCBqF-a3",
          kind: "triggered",
          text: "At the beginning of your recollection phase, recover X, where X is the amount of blood counters on Perfusive Envelopment.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "blood",
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default perfusiveEnvelopment;
