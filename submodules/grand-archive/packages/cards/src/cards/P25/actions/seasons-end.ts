import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seasonsEnd: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ddggqvxw8f",
  slug: "seasons-end",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ddggqvxw8f:face:default",
      catalogId: "ddggqvxw8f",
      name: "Season's End",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Diao Chan Bonus] This card costs 1 less to activate for each wither counter on objects on the field.\n\nDestroy each object with a wither counter on it.",
      abilities: [
        {
          id: "ddggqvxw8f-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] This card costs 1 less to activate for each wither counter on objects on the field.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
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
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "sum-counters",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                    },
                    counter: "wither",
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
          id: "ddggqvxw8f-a2",
          kind: "card-resolution",
          text: "Destroy each object with a wither counter on it.",
          effect: {
            kind: "destroy",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "has-counter",
                  counter: "wither",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default seasonsEnd;
