import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bannerRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fe3AaA7Qt3",
  slug: "banner-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fe3AaA7Qt3:face:default",
      catalogId: "fe3AaA7Qt3",
      name: "Banner Raccoon",
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
        life: 2,
      },
      rulesText:
        "As long as an opponent has no cards in their graveyard, other Raccoon allies you control get +1POWER.",
      abilities: [
        {
          id: "fe3AaA7Qt3-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent has no cards in their graveyard, other Raccoon allies you control get +1POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["RACCOON"],
                          },
                        ],
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default bannerRaccoon;
