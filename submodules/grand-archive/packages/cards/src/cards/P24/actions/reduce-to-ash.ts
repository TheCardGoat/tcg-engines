import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reduceToAsh: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sbalegbscx",
  slug: "reduce-to-ash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sbalegbscx:face:default",
      catalogId: "sbalegbscx",
      name: "Reduce to Ash",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText: "Destroy target item or weapon with memory cost 0 or reserve cost 4 or less.",
      abilities: [
        {
          id: "sbalegbscx-a1",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 0 or reserve cost 4 or less.",
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
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default reduceToAsh;
