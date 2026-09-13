import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfNotus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bFoUoGdZBX",
  slug: "lesser-boon-of-notus",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "bFoUoGdZBX:face:default",
      catalogId: "bFoUoGdZBX",
      name: "Lesser Boon of Notus",
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
      rulesText: "Wind element is enabled for you.\n",
      abilities: [
        {
          id: "bFoUoGdZBX-a1",
          kind: "static",
          staticKind: "effects",
          text: "Wind element is enabled for you.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WIND",
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

export default lesserBoonOfNotus;
