import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const charmOfAnticipation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vkL2RFh0yM",
  slug: "charm-of-anticipation",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "vkL2RFh0yM:face:default",
      catalogId: "vkL2RFh0yM",
      name: "Charm of Anticipation",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Charm of Anticipation: Draw a card. Activate this ability only if you have the Crowd's Favor status.",
      abilities: [
        {
          id: "vkL2RFh0yM-a1",
          kind: "activated",
          text: "Banish Charm of Anticipation: Draw a card. Activate this ability only if you have the Crowd's Favor status.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "player-state",
            player: "controller",
            state: {
              named: "crowds-favor",
            },
          },
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

export default charmOfAnticipation;
