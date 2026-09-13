import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shatteredHope: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XOevViFTB3",
  slug: "shattered-hope",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XOevViFTB3:face:default",
      catalogId: "XOevViFTB3",
      name: "Shattered Hope",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Merlin Bonus] This card costs 1 less to activate.\n\nGlimpse 1, then draw a card.\n\nUntil end of turn, allies enter the field with an additional sheen counter on them.",
      abilities: [
        {
          id: "XOevViFTB3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] This card costs 1 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
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
          id: "XOevViFTB3-a2",
          kind: "card-resolution",
          text: "Glimpse 1, then draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 1,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "XOevViFTB3-a3",
          kind: "card-resolution",
          text: "Until end of turn, allies enter the field with an additional sheen counter on them.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            operation: {
              kind: "add-object-counters",
              counters: [
                {
                  counter: {
                    named: "sheen",
                  },
                  amount: 1,
                },
              ],
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default shatteredHope;
