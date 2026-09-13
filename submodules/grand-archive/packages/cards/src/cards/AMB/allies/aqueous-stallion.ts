import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aqueousStallion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4le7ehjyxs",
  slug: "aqueous-stallion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4le7ehjyxs:face:default",
      catalogId: "4le7ehjyxs",
      name: "Aqueous Stallion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "As long as you have four or more water element cards in your graveyard, Aqueous Stallion gets +3 POWER.",
      abilities: [
        {
          id: "4le7ehjyxs-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have four or more water element cards in your graveyard, Aqueous Stallion gets +3 POWER.",
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
                  right: 4,
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default aqueousStallion;
