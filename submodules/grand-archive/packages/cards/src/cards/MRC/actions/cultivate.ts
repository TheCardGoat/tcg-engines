import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cultivate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cy3gme0xxw",
  slug: "cultivate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cy3gme0xxw:face:default",
      catalogId: "cy3gme0xxw",
      name: "Cultivate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 1 (You may reserve all cards revealed as you activate this card. If at least one of them is wind element, this card becomes imbued.)\n\nFor every three Herb items you control,  gather. Then if Cultivate is imbued, gather an additional time.",
      abilities: [
        {
          id: "cy3gme0xxw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 1 (You may reserve all cards revealed as you activate this card. If at least one of them is wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 1,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "cy3gme0xxw-a2",
          kind: "card-resolution",
          text: "For every three Herb items you control,  gather. Then if Cultivate is imbued, gather an additional time.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "repeat",
                count: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ITEM"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["HERB"],
                            },
                          ],
                        },
                      },
                    },
                    3,
                  ],
                  rounding: "down",
                },
                effect: {
                  kind: "keyword-action",
                  action: "gather",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: {
                  kind: "keyword-action",
                  action: "gather",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cultivate;
