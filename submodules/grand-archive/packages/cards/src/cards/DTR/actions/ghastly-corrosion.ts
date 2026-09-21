import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghastlyCorrosion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "40xhntos3d",
  slug: "ghastly-corrosion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "40xhntos3d:face:default",
      catalogId: "40xhntos3d",
      name: "Ghastly Corrosion",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPECTER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 1 less to activate for each of up to two ephemeral objects you control.\n\nDestroy target item or weapon with memory cost 0 or reserve cost 4 or less.",
      abilities: [
        {
          id: "40xhntos3d-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate for each of up to two ephemeral objects you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "minimum",
                    operands: [
                      {
                        kind: "count",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "object-state",
                            state: "ephemeral",
                          },
                        },
                      },
                      2,
                    ],
                  },
                  1,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "40xhntos3d-a2",
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

export default ghastlyCorrosion;
