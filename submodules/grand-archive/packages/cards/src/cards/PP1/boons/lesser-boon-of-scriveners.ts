import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfScriveners: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nJOde7e1Xc",
  slug: "lesser-boon-of-scriveners",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "nJOde7e1Xc:face:default",
      catalogId: "nJOde7e1Xc",
      name: "Lesser Boon of Scriveners",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, scavenge 10 for a Spell card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "nJOde7e1Xc-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 10 for a Spell card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
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
              kind: "subtype",
              oneOf: ["SPELL"],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfScriveners;
