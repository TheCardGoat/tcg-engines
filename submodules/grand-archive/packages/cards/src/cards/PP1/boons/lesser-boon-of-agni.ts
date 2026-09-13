import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfAgni: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nbKHFHcvzd",
  slug: "lesser-boon-of-agni",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "nbKHFHcvzd:face:default",
      catalogId: "nbKHFHcvzd",
      name: "Lesser Boon of Agni",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Fire element is enabled for you.",
      abilities: [
        {
          id: "nbKHFHcvzd-a1",
          kind: "static",
          staticKind: "effects",
          text: "Fire element is enabled for you.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "FIRE",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfAgni;
