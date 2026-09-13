import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swornWindhand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9ewgUjy34b",
  slug: "sworn-windhand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9ewgUjy34b:face:default",
      catalogId: "9ewgUjy34b",
      name: "Sworn Windhand",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Taunt\n\nSworn Windhand has retort 2+X, where X is the amount of omens you have. (As long as this ally is retaliating, it gets that much POWER.)",
      abilities: [
        {
          id: "9ewgUjy34b-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt",
          keyword: {
            name: "taunt",
          },
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
        },
        {
          id: "9ewgUjy34b-a2",
          kind: "static",
          staticKind: "effects",
          text: "Sworn Windhand has retort 2+X, where X is the amount of omens you have. (As long as this ally is retaliating, it gets that much POWER.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "retort",
                  value: {
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
            },
          ],
        },
      ],
    },
  },
};

export default swornWindhand;
