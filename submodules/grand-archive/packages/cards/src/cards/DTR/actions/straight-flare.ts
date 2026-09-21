import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const straightFlare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "28bjn8g50v",
  slug: "straight-flare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "28bjn8g50v:face:default",
      catalogId: "28bjn8g50v",
      name: "Straight Flare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal X damage to target unit, where X is the amount of Suited objects you control with different costs plus 1. \n\n",
      abilities: [
        {
          id: "28bjn8g50v-a1",
          kind: "card-resolution",
          text: "Deal X damage to target unit, where X is the amount of Suited objects you control with different costs plus 1.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "count",
                    distinctBy: "reserve-cost",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SUITED"],
                      },
                    },
                  },
                  1,
                ],
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default straightFlare;
