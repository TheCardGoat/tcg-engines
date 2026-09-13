import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfTimesPassage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZRmjF8O3rf",
  slug: "lesser-boon-of-times-passage",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "ZRmjF8O3rf:face:default",
      catalogId: "ZRmjF8O3rf",
      name: "Lesser Boon of Time's Passage",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, draw a card into your memory. Trigger this ability only twice.",
      abilities: [
        {
          id: "ZRmjF8O3rf-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, draw a card into your memory. Trigger this ability only twice.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          limit: {
            count: 2,
            per: "source-instance",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default lesserBoonOfTimesPassage;
