import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfEnchantment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "56ZA1DHSBp",
  slug: "lesser-boon-of-enchantment",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "56ZA1DHSBp:face:default",
      catalogId: "56ZA1DHSBp",
      name: "Lesser Boon of Enchantment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, scavenge 10 for a phantasia card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "56ZA1DHSBp-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 10 for a phantasia card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
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
              oneOf: ["PHANTASIA"],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfEnchantment;
