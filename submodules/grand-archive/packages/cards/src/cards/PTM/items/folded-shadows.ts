import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const foldedShadows: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HL4Q3UBoH8",
  slug: "folded-shadows",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HL4Q3UBoH8:face:default",
      catalogId: "HL4Q3UBoH8",
      name: "Folded Shadows",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "FAN"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "[Ciel Bonus] As long as the total reserve cost among your omens is 33 or greater, your champion has spellshroud and stealth.",
      abilities: [
        {
          id: "HL4Q3UBoH8-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as the total reserve cost among your omens is 33 or greater, your champion has spellshroud and stealth.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "aggregate-property",
                    operation: "sum",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                    property: "reserve-cost",
                    basis: "current",
                    emptyValue: 0,
                  },
                  operator: "gte",
                  right: 33,
                },
              },
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
                  name: "spellshroud",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "aggregate-property",
                    operation: "sum",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                    property: "reserve-cost",
                    basis: "current",
                    emptyValue: 0,
                  },
                  operator: "gte",
                  right: 33,
                },
              },
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
                  name: "stealth",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default foldedShadows;
