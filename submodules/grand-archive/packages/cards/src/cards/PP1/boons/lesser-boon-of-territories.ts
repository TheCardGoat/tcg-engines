import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfTerritories: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZpM7gliLxm",
  slug: "lesser-boon-of-territories",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "ZpM7gliLxm:face:default",
      catalogId: "ZpM7gliLxm",
      name: "Lesser Boon of Territories",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, scavenge 10 for a domain card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "ZpM7gliLxm-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 10 for a domain card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 10,
            filter: {
              kind: "type",
              oneOf: ["DOMAIN"],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfTerritories;
