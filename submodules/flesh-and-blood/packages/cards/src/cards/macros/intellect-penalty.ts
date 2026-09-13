import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/macros/intellect-penalty.generated.ts";

export const intellectPenalty = defineCard(fabCardIdentitiesByCanonicalId.QGjhRDwJdHr68gtkNqCWm, {
  abilities: {
    reduceIntellect: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "intellect",
        op: "subtract",
        amount: 1,
        target: {
          selector: "controller",
        },
        duration: "while-in-arena",
      },
    },
    accumulateTurnCounters: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          filter: {
            name: "Intellect Penalty",
          },
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "turn",
          },
          count: {
            type: "x",
          },
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    replaceEndTurnDraw: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "draw",
          player: "controller",
        },
        modification: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: {
                type: "event-amount",
              },
              player: "controller",
            },
            {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "turn",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "has-counter",
                counter: {
                  kind: "named",
                  name: "turn",
                },
                target: {
                  selector: "self",
                },
                comparison: {
                  op: "eq",
                  value: 0,
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "banished",
                },
              },
            },
          ],
        },
        duration: "while-in-arena",
      },
    },
  },
});
