import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const battlefieldBenediction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HcR3O8vDps",
  slug: "battlefield-benediction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HcR3O8vDps:face:default",
      catalogId: "HcR3O8vDps",
      name: "Battlefield Benediction",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nEmpower 2. If an opponent controls three or more units, empower 4 instead.",
      abilities: [
        {
          id: "HcR3O8vDps-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "HcR3O8vDps-a2",
          kind: "card-resolution",
          text: "Empower 2. If an opponent controls three or more units, empower 4 instead.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                operator: "gte",
                right: 3,
              },
            },
            then: {
              kind: "keyword-action",
              action: "empower",
              amount: 4,
            },
            else: {
              kind: "keyword-action",
              action: "empower",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default battlefieldBenediction;
