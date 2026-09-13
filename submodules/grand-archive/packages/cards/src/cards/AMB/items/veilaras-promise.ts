import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veilarasPromise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rcwr60wa5b",
  slug: "veilaras-promise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rcwr60wa5b:face:default",
      catalogId: "rcwr60wa5b",
      name: "Veilara's Promise",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever you activate a Spell card, put a refinement counter on Veilara's Promise. Then if there are three or more refinement counters on Veilara's Promise, you may banish it. If you do, draw a card.",
      abilities: [
        {
          id: "rcwr60wa5b-a1",
          kind: "triggered",
          text: "Whenever you activate a Spell card, put a refinement counter on Veilara's Promise. Then if there are three or more refinement counters on Veilara's Promise, you may banish it. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
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

export default veilarasPromise;
