import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tempestuousConviction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6Rb25k7OjY",
  slug: "tempestuous-conviction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6Rb25k7OjY:face:default",
      catalogId: "6Rb25k7OjY",
      name: "Tempestuous Conviction",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL", "REACTION"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus] This card costs 2 less to activate.\n\nTarget unit gains spellshroud until end of turn. Then if your influence is five or less, draw a card into your memory.",
      abilities: [
        {
          id: "6Rb25k7OjY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "6Rb25k7OjY-a2",
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
          id: "6Rb25k7OjY-a3",
          kind: "card-resolution",
          text: "Target unit gains spellshroud until end of turn. Then if your influence is five or less, draw a card into your memory.",
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
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "player-property",
                      player: "controller",
                      property: "influence",
                    },
                    operator: "lte",
                    right: 5,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tempestuousConviction;
