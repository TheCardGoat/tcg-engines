import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diluAuspiciousCharger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "du4eaktghh",
  slug: "dilu-auspicious-charger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "du4eaktghh:face:default",
      catalogId: "du4eaktghh",
      name: "Dilu, Auspicious Charger",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER", "RANGER"],
        subtypes: ["TAMER", "RANGER", "BEAST", "HORSE"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "Pride 3 (This ally won't obey you unless your champion is level 3 or higher. You can't attack with, intercept with, or activate abilities of allies that don't obey you.)\n\nAs long as you control a wind element unique Human ally, Dilu loses pride and has vigor.",
      abilities: [
        {
          id: "du4eaktghh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won't obey you unless your champion is level 3 or higher. You can't attack with, intercept with, or activate abilities of allies that don't obey you.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "du4eaktghh-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a wind element unique Human ally, Dilu loses pride and has vigor.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
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
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
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
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default diluAuspiciousCharger;
