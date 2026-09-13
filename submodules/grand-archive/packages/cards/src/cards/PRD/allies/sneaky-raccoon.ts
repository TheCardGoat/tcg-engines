import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sneakyRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jH6F9XYrL5",
  slug: "sneaky-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jH6F9XYrL5:face:default",
      catalogId: "jH6F9XYrL5",
      name: "Sneaky Raccoon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as an opponent has no cards in their graveyard, Sneaky Raccoon has stealth. (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "jH6F9XYrL5-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent has no cards in their graveyard, Sneaky Raccoon has stealth. (This unit can’t be targeted by attacks unless permitted by true sight.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "eq",
                value: 0,
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

export default sneakyRaccoon;
