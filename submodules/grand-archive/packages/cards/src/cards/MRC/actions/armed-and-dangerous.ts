import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const armedAndDangerous: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gs1Usdd5R2",
  slug: "armed-and-dangerous",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gs1Usdd5R2:face:default",
      catalogId: "gs1Usdd5R2",
      name: "Armed and Dangerous",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Draw a card for each of up to two Gun weapons you control.",
      abilities: [
        {
          id: "gs1Usdd5R2-a1",
          kind: "card-resolution",
          text: "Draw a card for each of up to two Gun weapons you control.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "minimum",
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
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["GUN"],
                        },
                      ],
                    },
                  },
                },
                2,
              ],
            },
          },
        },
      ],
    },
  },
};

export default armedAndDangerous;
