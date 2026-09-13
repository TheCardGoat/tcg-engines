import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const convergeReflections: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TBVLLRPiwP",
  slug: "converge-reflections",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TBVLLRPiwP:face:default",
      catalogId: "TBVLLRPiwP",
      name: "Converge Reflections",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a non-token item or weapon.\n\nDestroy target item or weapon with memory cost 0 or reserve cost 4 or less. If that object was a Distortion, draw a card into your memory.",
      abilities: [
        {
          id: "TBVLLRPiwP-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a non-token item or weapon.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "token",
                      value: false,
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TBVLLRPiwP-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 0 or reserve cost 4 or less. If that object was a Distortion, draw a card into your memory.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM", "WEAPON"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 0,
                          },
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 4,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "tracked",
                    key: "destroyed-object",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["DISTORTION"],
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default convergeReflections;
