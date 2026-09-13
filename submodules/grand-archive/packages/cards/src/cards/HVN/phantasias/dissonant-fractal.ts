import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dissonantFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2d7rgchttu",
  slug: "dissonant-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2d7rgchttu:face:default",
      catalogId: "2d7rgchttu",
      name: "Dissonant Fractal",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Glimpse 4.\n\nAs long as you control two or more other phantasias, Dissonant Fractal has reservable. (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "2d7rgchttu-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 4.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 4,
          },
        },
        {
          id: "2d7rgchttu-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more other phantasias, Dissonant Fractal has reservable. (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
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
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["PHANTASIA"],
                          },
                          {
                            kind: "not-source",
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
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
                  name: "reservable",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default dissonantFractal;
