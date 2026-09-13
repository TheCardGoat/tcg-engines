import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shatterTheBrittle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tdz5of8zuz",
  slug: "shatter-the-brittle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tdz5of8zuz:face:default",
      catalogId: "tdz5of8zuz",
      name: "Shatter the Brittle",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATEBOUND", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if you control a Fatestone or Fatebound object.\n\nDestroy target item or weapon with memory cost 1 or less, or with reserve cost 5 or less. If you do, its controller draws a card into their memory.",
      abilities: [
        {
          id: "tdz5of8zuz-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if you control a Fatestone or Fatebound object.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["FATESTONE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FATEBOUND"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "tdz5of8zuz-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 1 or less, or with reserve cost 5 or less. If you do, its controller draws a card into their memory.",
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
                            right: 1,
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
                            right: 5,
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
                kind: "attempt",
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  bindResultAs: "destroyed-object",
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "draw",
                  player: {
                    controllerOf: "destroyed-object",
                  },
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

export default shatterTheBrittle;
