import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unstableFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2o82fwl22v",
  slug: "unstable-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2o82fwl22v:face:default",
      catalogId: "2o82fwl22v",
      name: "Unstable Fractal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nReservable\n\n[Class Bonus] (3), REST, Sacrifice Unstable Fractal: As a Spell, destroy target item with memory cost 0 or reserve cost 5 or less. ",
      abilities: [
        {
          id: "2o82fwl22v-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "2o82fwl22v-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "2o82fwl22v-a3",
          kind: "activated",
          text: "[Class Bonus] (3), REST, Sacrifice Unstable Fractal: As a Spell, destroy target item with memory cost 0 or reserve cost 5 or less.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
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
                      oneOf: ["ITEM"],
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
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              bindResultAs: "destroyed-object",
            },
          },
        },
      ],
    },
  },
};

export default unstableFractal;
