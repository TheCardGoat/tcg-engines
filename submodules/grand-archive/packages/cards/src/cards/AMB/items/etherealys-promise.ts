import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const etherealysPromise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7n0bv1sqgb",
  slug: "etherealys-promise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7n0bv1sqgb:face:default",
      catalogId: "7n0bv1sqgb",
      name: "Etherealys' Promise",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever an ally you control dies, put a refinement counter on Etherealys' Promise. Then if there are three or more refinement counters on Etherealys' Promise, you may banish it. If you do, draw a card.",
      abilities: [
        {
          id: "7n0bv1sqgb-a1",
          kind: "triggered",
          text: "Whenever an ally you control dies, put a refinement counter on Etherealys' Promise. Then if there are three or more refinement counters on Etherealys' Promise, you may banish it. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "refinement",
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  effect: {
                    kind: "reflexive",
                    action: {
                      kind: "banish-object",
                      subject: {
                        kind: "source",
                      },
                    },
                    consequence: {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  },
                  allOrNothing: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default etherealysPromise;
