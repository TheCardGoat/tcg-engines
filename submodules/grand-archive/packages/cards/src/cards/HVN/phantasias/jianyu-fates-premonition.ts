import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jianyuFatesPremonition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qv0vn6tuow",
  slug: "jianyu-fates-premonition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qv0vn6tuow:face:default",
      catalogId: "qv0vn6tuow",
      name: "Jianyu, Fate's Premonition",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nAs Jianyu enters the field, choose a card name.\n\nCards with the chosen name cost (2+X) more to activate, where X is the amount of phantasias you control.",
      abilities: [
        {
          id: "qv0vn6tuow-a1",
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
          id: "qv0vn6tuow-a2",
          kind: "static",
          staticKind: "effects",
          text: "As Jianyu enters the field, choose a card name.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose-value",
                  selection: {
                    id: "entry-choice",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "characteristic",
                      characteristic: "card-name",
                    },
                  },
                  trackAs: "chosen-card-name",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qv0vn6tuow-a3",
          kind: "static",
          staticKind: "effects",
          text: "Cards with the chosen name cost (2+X) more to activate, where X is the amount of phantasias you control.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "matches-tracked-characteristic",
                key: "chosen-card-name",
                characteristic: "card-name",
              },
              costOperation: "add",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  2,
                  {
                    kind: "variable",
                    symbol: "X",
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

export default jianyuFatesPremonition;
