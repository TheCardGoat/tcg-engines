import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fumantShieldmaiden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r3bmriltuw",
  slug: "fumant-shieldmaiden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r3bmriltuw:face:default",
      catalogId: "r3bmriltuw",
      name: "Fumant Shieldmaiden",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as your influence is less than the amount of omens you have, Fumant Shieldmaiden gets +2POWER. (A player's influence is equal to the total amount of cards in their hand and memory.) \n\nOn Death: Each player with influence four or less draws a card.",
      abilities: [
        {
          id: "r3bmriltuw-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your influence is less than the amount of omens you have, Fumant Shieldmaiden gets +2POWER. (A player's influence is equal to the total amount of cards in their hand and memory.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                  operator: "lt",
                  right: {
                    kind: "player-property",
                    player: "controller",
                    property: "omens",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "r3bmriltuw-a2",
          kind: "triggered",
          text: "On Death: Each player with influence four or less draws a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "eligible-player",
            effect: {
              kind: "conditional",
              condition: {
                kind: "player-property-compare",
                players: {
                  binding: "eligible-player",
                },
                quantifier: "all",
                property: "influence",
                operator: "lte",
                value: 4,
              },
              then: {
                kind: "draw",
                player: {
                  binding: "eligible-player",
                },
                amount: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default fumantShieldmaiden;
