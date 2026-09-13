import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const torpidFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h9u9584zpn",
  slug: "torpid-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h9u9584zpn:face:default",
      catalogId: "h9u9584zpn",
      name: "Torpid Fractal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Rest target ally with 2 POWER or less. That ally doesn't wake up during its controller's wake up phase as long as you control Torpid Fractal.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "h9u9584zpn-a1",
          kind: "triggered",
          text: "On Enter: Rest target ally with 2 POWER or less. That ally doesn't wake up during its controller's wake up phase as long as you control Torpid Fractal.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "power",
                          basis: "current",
                        },
                        operator: "lte",
                        right: 2,
                      },
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
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "phase",
                      phase: "wake-up",
                    },
                    {
                      kind: "turn-player",
                      player: {
                        controllerOf: "target-1",
                      },
                    },
                    {
                      kind: "controls-subject",
                      player: "controller",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
                duration: {
                  kind: "while-source-on-field",
                },
              },
            ],
          },
        },
        {
          id: "h9u9584zpn-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default torpidFractal;
