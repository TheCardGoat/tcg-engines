import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const engulf: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IPmK09iEIT",
  slug: "engulf",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IPmK09iEIT:face:default",
      catalogId: "IPmK09iEIT",
      name: "Engulf",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 3 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nNegate target non-attack card activation. ",
      abilities: [
        {
          id: "IPmK09iEIT-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 3 less to activate. (Apply this effect only if your champion is level 2 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "IPmK09iEIT-a2",
          kind: "card-resolution",
          text: "Negate target non-attack card activation.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                sourceFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "negate",
            subject: {
              kind: "bound",
              binding: "target-stack-item",
            },
            bindResultAs: "negated-stack-item",
          },
        },
      ],
    },
  },
};

export default engulf;
