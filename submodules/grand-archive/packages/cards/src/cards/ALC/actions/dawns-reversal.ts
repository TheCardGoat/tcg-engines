import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dawnsReversal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x53jgq8aad",
  slug: "dawns-reversal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x53jgq8aad:face:default",
      catalogId: "x53jgq8aad",
      name: "Dawn's Reversal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] As long as a card activation has been negated this turn, this card costs 4 less to activate.\n\nGlimpse LV. Deal LV damage to target unit.",
      abilities: [
        {
          id: "x53jgq8aad-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as a card activation has been negated this turn, this card costs 4 less to activate.",
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
              condition: {
                kind: "history",
                event: "stack-item-negated",
                window: "this-turn",
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 4,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "x53jgq8aad-a2",
          kind: "card-resolution",
          text: "Glimpse LV. Deal LV damage to target unit.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dawnsReversal;
