import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunblessedGazelle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4ilomec3u3",
  slug: "sunblessed-gazelle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4ilomec3u3:face:default",
      catalogId: "4ilomec3u3",
      name: "Sunblessed Gazelle",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "ANTELOPE"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Taunt\n\nOn Enter: If your influence is three or less, draw a card and recover 3.\n\nSunblessed Gazelle gets +X LIFE where X is the highest influence among your opponents.",
      abilities: [
        {
          id: "4ilomec3u3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "4ilomec3u3-a2",
          kind: "triggered",
          text: "On Enter: If your influence is three or less, draw a card and recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
                operator: "lte",
                right: 3,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
                {
                  kind: "recover",
                  player: "controller",
                  amount: 3,
                },
              ],
            },
          },
        },
        {
          id: "4ilomec3u3-a3",
          kind: "static",
          staticKind: "effects",
          text: "Sunblessed Gazelle gets +X LIFE where X is the highest influence among your opponents.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-player-property",
                operation: "maximum",
                players: "each-opponent",
                property: "influence",
                emptyValue: 0,
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                property: "life",
                operation: "add",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default sunblessedGazelle;
