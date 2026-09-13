import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bannerSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gz92tQGwCZ",
  slug: "banner-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gz92tQGwCZ:face:default",
      catalogId: "gz92tQGwCZ",
      name: "Banner Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] REST: Other Slime allies you control get +1POWER until end of turn.",
      abilities: [
        {
          id: "gz92tQGwCZ-a1",
          kind: "activated",
          text: "[Class Bonus] REST: Other Slime allies you control get +1POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
          effect: {
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
                          oneOf: ["SLIME"],
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
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
        },
      ],
    },
  },
};

export default bannerSlime;
