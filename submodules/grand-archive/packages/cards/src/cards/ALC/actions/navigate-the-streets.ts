import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const navigateTheStreets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8jypwc8tuh",
  slug: "navigate-the-streets",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8jypwc8tuh:face:default",
      catalogId: "8jypwc8tuh",
      name: "Navigate the Streets",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Glimpse 1+X, where X is the amount of domains you control. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nFloating Memory",
      abilities: [
        {
          id: "8jypwc8tuh-a1",
          kind: "card-resolution",
          text: "Glimpse 1+X, where X is the amount of domains you control. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                1,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
        {
          id: "8jypwc8tuh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default navigateTheStreets;
