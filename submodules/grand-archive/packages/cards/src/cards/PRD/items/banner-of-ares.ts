import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bannerOfAres: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d770iLKEKx",
  slug: "banner-of-ares",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d770iLKEKx:face:default",
      catalogId: "d770iLKEKx",
      name: "Banner of Ares",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARTIFACT"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Whenever you activate a wind element card, if there are less than four refinement counters on Banner of Ares, put a refinement counter on Banner of Ares.\n\nAs long as there are four or more refinement counters on Banner of Ares, each wind element ally that enters the field under your control enters with an additional buff counter on them.",
      abilities: [
        {
          id: "d770iLKEKx-a1",
          kind: "triggered",
          text: "Whenever you activate a wind element card, if there are less than four refinement counters on Banner of Ares, put a refinement counter on Banner of Ares.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
            },
          },
          effect: {
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
                operator: "lt",
                right: 4,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "refinement",
              },
              amount: 1,
            },
          },
        },
        {
          id: "d770iLKEKx-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as there are four or more refinement counters on Banner of Ares, each wind element ally that enters the field under your control enters with an additional buff counter on them.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    ],
                  },
                },
              },
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
                  right: 4,
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "buff",
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
      ],
    },
  },
};

export default bannerOfAres;
