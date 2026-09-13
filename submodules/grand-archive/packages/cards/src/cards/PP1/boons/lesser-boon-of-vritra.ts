import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfVritra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Kf0t7qyLaH",
  slug: "lesser-boon-of-vritra",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "Kf0t7qyLaH:face:default",
      catalogId: "Kf0t7qyLaH",
      name: "Lesser Boon of Vritra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As you gain this boon, each player draws a card. Then deal 2 damage to each champion controlled by players with influence more than seven.",
      abilities: [
        {
          id: "Kf0t7qyLaH-a1",
          kind: "triggered",
          text: "As you gain this boon, each player draws a card. Then deal 2 damage to each champion controlled by players with influence more than seven.",
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "each-player",
                amount: 1,
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default lesserBoonOfVritra;
