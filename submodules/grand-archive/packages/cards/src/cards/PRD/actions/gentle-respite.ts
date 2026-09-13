import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gentleRespite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ddv1au7t9m",
  slug: "gentle-respite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ddv1au7t9m:face:default",
      catalogId: "ddv1au7t9m",
      name: "Gentle Respite",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "If target opponent's influence is greater than yours, draw a card into your memory. (A player’s influence is equal to the total amount of cards in their hand and memory.)\n\nFloating Memory",
      abilities: [
        {
          id: "ddv1au7t9m-a1",
          kind: "card-resolution",
          text: "If target opponent's influence is greater than yours, draw a card into your memory. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: {
                    binding: "target-opponent",
                  },
                  property: "influence",
                },
                operator: "gt",
                right: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
        {
          id: "ddv1au7t9m-a2",
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

export default gentleRespite;
