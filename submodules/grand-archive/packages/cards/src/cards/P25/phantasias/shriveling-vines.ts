import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shrivelingVines: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6gt6zkly69",
  slug: "shriveling-vines",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6gt6zkly69:face:default",
      catalogId: "6gt6zkly69",
      name: "Shriveling Vines",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ROOT", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nAt the beginning of your end phase, put two wither counters on target non-champion non-token object you don't control.",
      abilities: [
        {
          id: "6gt6zkly69-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "6gt6zkly69-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, put two wither counters on target non-champion non-token object you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: false,
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "wither",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default shrivelingVines;
