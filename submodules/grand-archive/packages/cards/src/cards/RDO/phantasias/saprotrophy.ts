import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const saprotrophy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qSxEKgmQ0I",
  slug: "saprotrophy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qSxEKgmQ0I:face:default",
      catalogId: "qSxEKgmQ0I",
      name: "Saprotrophy",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "On Enter:  Recover 2+X, where X is the amount of tera element cards in your banishment.\n\n[Diao Chan Bonus] Objects your opponents control enter the field with an additional wither counter on them.",
      abilities: [
        {
          id: "qSxEKgmQ0I-a1",
          kind: "triggered",
          text: "On Enter:  Recover 2+X, where X is the amount of tera element cards in your banishment.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["TERA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
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
          },
        },
        {
          id: "qSxEKgmQ0I-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] Objects your opponents control enter the field with an additional wither counter on them.",
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
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "wither",
                    amount: 1,
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

export default saprotrophy;
