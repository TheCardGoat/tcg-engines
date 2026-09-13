import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reverentSeraphim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e5r6eVzpkD",
  slug: "reverent-seraphim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e5r6eVzpkD:face:default",
      catalogId: "e5r6eVzpkD",
      name: "Reverent Seraphim",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)\n\nAs long as Reverent Seraphim is imbued, other allies get -1POWER.",
      abilities: [
        {
          id: "e5r6eVzpkD-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "advanced",
          },
        },
        {
          id: "e5r6eVzpkD-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Reverent Seraphim is imbued, other allies get -1POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default reverentSeraphim;
