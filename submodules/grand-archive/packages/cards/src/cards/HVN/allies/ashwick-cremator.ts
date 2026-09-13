import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ashwickCremator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xwtkzqxfab",
  slug: "ashwick-cremator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xwtkzqxfab:face:default",
      catalogId: "xwtkzqxfab",
      name: "Ashwick Cremator",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] At the beginning of your end phase, if you have no cards in your hand, deal 2 damage to each champion.",
      abilities: [
        {
          id: "xwtkzqxfab-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, if you have no cards in your hand, deal 2 damage to each champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["hand"],
                    player: "controller",
                  },
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
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
          },
        },
      ],
    },
  },
};

export default ashwickCremator;
