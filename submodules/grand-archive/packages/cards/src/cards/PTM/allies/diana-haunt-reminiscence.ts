import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaHauntReminiscence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qp2r93Bgpj",
  slug: "diana-haunt-reminiscence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qp2r93Bgpj:face:default",
      catalogId: "qp2r93Bgpj",
      name: "Diana, Haunt Reminiscence",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "DISTORTION", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Diana has ranged 3+X, where X is three times the amount of Curse cards in your champion's lineage.\n\n[Class Bonus] Curse cards in your champion's lineage lose all abilities.",
      abilities: [
        {
          id: "qp2r93Bgpj-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Diana has ranged 3+X, where X is three times the amount of Curse cards in your champion's lineage.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      host: {
                        kind: "champion",
                        player: "controller",
                      },
                      relationship: "lineage-of",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  3,
                ],
              },
            },
          ],
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
                  name: "ranged",
                  value: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      3,
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
        {
          id: "qp2r93Bgpj-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Curse cards in your champion's lineage lose all abilities.",
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
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["inner-lineage"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["CURSE"],
                  },
                },
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
                kind: "remove-abilities",
              },
            },
          ],
        },
      ],
    },
  },
};

export default dianaHauntReminiscence;
