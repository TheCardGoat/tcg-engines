import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const astralShard: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> =
  {
    canonicalId: "eP07Xxscuq",
    slug: "astral-shard",
    definitionKind: "token-representation",
    layout: {
      kind: "single-faced",
      face: {
        id: "eP07Xxscuq:face:default",
        catalogId: "eP07Xxscuq",
        name: "Astral Shard",
        cost: {
          kind: "reserve",
          amount: 0,
        },
        typeLine: {
          supertypes: [],
          types: ["PHANTASIA"],
          classes: ["CLERIC"],
          subtypes: ["CLERIC", "SHARD"],
        },
        elements: ["ASTRA"],
        stats: {},
        rulesText: "Sacrifice Astral Shard: Glimpse 2.",
        abilities: [
          {
            id: "eP07Xxscuq-a1",
            kind: "activated",
            text: "Sacrifice Astral Shard: Glimpse 2.",
            activation: "ability",
            cost: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
            effect: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 2,
            },
          },
        ],
      },
    },
  };

export default astralShard;
