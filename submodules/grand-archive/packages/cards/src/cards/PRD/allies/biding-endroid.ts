import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bidingEndroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mBxHYyldS6",
  slug: "biding-endroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mBxHYyldS6:face:default",
      catalogId: "mBxHYyldS6",
      name: "Biding Endroid",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "As long as each player has four or less cards in their material deck, Biding Endroid gets +3POWER and +3LIFE.",
      abilities: [
        {
          id: "mBxHYyldS6-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as each player has four or less cards in their material deck, Biding Endroid gets +3POWER and +3LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-player",
                quantifier: "all",
                zone: "material-deck",
                operator: "lte",
                value: 4,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 3,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-player",
                quantifier: "all",
                zone: "material-deck",
                operator: "lte",
                value: 4,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default bidingEndroid;
