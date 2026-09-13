import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jadelightProtector: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o18wr3f4ab",
  slug: "jadelight-protector",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o18wr3f4ab:face:default",
      catalogId: "o18wr3f4ab",
      name: "Jadelight Protector",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as your Shifting Currents face South, allies you control have steadfast and retort 1. (An ally with steadfast can retaliate while rested and doesn’t rest to do so. As long as an ally with retort 1 is retaliating, it gets +1 POWER.)",
      abilities: [
        {
          id: "o18wr3f4ab-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face South, allies you control have steadfast and retort 1. (An ally with steadfast can retaliate while rested and doesn’t rest to do so. As long as an ally with retort 1 is retaliating, it gets +1 POWER.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "steadfast",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "retort",
                  value: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default jadelightProtector;
