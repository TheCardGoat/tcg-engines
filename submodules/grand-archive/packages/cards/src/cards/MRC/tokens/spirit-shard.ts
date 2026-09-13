import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritShard: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> =
  {
    canonicalId: "3p5iqigcom",
    slug: "spirit-shard",
    definitionKind: "token-representation",
    layout: {
      kind: "single-faced",
      face: {
        id: "3p5iqigcom:face:default",
        catalogId: "3p5iqigcom",
        name: "Spirit Shard",
        cost: {
          kind: "reserve",
          amount: 3,
        },
        typeLine: {
          supertypes: [],
          types: ["PHANTASIA"],
          classes: ["SPIRIT"],
          subtypes: ["SPIRIT", "SHARD"],
        },
        elements: ["NORM"],
        stats: {},
        rulesText: "[Level 3+] Sacrifice Spirit Shard: Draw a card.",
        abilities: [
          {
            id: "3p5iqigcom-a1",
            kind: "activated",
            text: "[Level 3+] Sacrifice Spirit Shard: Draw a card.",
            activation: "ability",
            cost: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
            restrictions: [
              {
                kind: "static",
                name: "level-restriction",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
              },
            ],
            effect: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        ],
      },
    },
  };

export default spiritShard;
