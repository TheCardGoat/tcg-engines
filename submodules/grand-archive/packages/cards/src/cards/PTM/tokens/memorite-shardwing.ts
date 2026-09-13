import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const memoriteShardwing: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "LxF5riNjnL",
  slug: "memorite-shardwing",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "LxF5riNjnL:face:default",
      catalogId: "LxF5riNjnL",
      name: "Memorite Shardwing",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "MEMORITE", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText: "Stealth, True Sight",
      abilities: [
        {
          id: "LxF5riNjnL-a1",
          kind: "keyword-group",
          text: "Stealth, True Sight",
          keywords: [
            {
              name: "stealth",
            },
            {
              name: "true-sight",
            },
          ],
        },
      ],
    },
  },
};

export default memoriteShardwing;
