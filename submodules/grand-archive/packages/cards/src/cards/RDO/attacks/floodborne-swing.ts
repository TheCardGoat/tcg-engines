import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floodborneSwing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5wLtoxd4Wc",
  slug: "floodborne-swing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5wLtoxd4Wc:face:default",
      catalogId: "5wLtoxd4Wc",
      name: "Floodborne Swing",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus]Deluge 3 — As long as you have three or more water element cards in your graveyard, Floodborne Swing gets +4POWER.\n",
      abilities: [
        {
          id: "5wLtoxd4Wc-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus]Deluge 3 — As long as you have three or more water element cards in your graveyard, Floodborne Swing gets +4POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
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
                amount: 4,
              },
            },
          ],
          label: {
            name: "Deluge 3",
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
      ],
    },
  },
};

export default floodborneSwing;
