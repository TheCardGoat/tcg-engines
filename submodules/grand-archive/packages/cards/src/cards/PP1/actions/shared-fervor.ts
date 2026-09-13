import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sharedFervor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RnUpMoSb4w",
  slug: "shared-fervor",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "RnUpMoSb4w:face:default",
      catalogId: "RnUpMoSb4w",
      name: "Shared Fervor",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Each player draws a card into their memory. You gain the Crowd's Favor status.",
      abilities: [
        {
          id: "RnUpMoSb4w-a1",
          kind: "card-resolution",
          text: "Each player draws a card into their memory. You gain the Crowd's Favor status.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "each-player",
                amount: 1,
                to: "memory",
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "Crowd's Favor",
                },
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default sharedFervor;
