import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfPoseidon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xTY2LZ01o7",
  slug: "lesser-boon-of-poseidon",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "xTY2LZ01o7:face:default",
      catalogId: "xTY2LZ01o7",
      name: "Lesser Boon of Poseidon",
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
      rulesText: "Water element is enabled for you.\n",
      abilities: [
        {
          id: "xTY2LZ01o7-a1",
          kind: "static",
          staticKind: "effects",
          text: "Water element is enabled for you.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WATER",
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

export default lesserBoonOfPoseidon;
