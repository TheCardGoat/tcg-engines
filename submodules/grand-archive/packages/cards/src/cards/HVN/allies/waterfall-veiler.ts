import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterfallVeiler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x6jo8zxhl9",
  slug: "waterfall-veiler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x6jo8zxhl9:face:default",
      catalogId: "x6jo8zxhl9",
      name: "Waterfall Veiler",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.) \nOn Champion Hit: That opponent puts the top four cards of their deck into their graveyard.",
      abilities: [
        {
          id: "x6jo8zxhl9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
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
        },
        {
          id: "x6jo8zxhl9-a2",
          kind: "triggered",
          text: "On Champion Hit: That opponent puts the top four cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "mill",
            player: "event-recipient-controller",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default waterfallVeiler;
