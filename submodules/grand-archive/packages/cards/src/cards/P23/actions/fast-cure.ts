import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fastCure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3oda2ha4dk",
  slug: "fast-cure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3oda2ha4dk:face:default",
      catalogId: "3oda2ha4dk",
      name: "Fast Cure",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "If target opponent's influence is greater than yours, recover 4. (A player's influence is equal to the total amount of cards in their hand and memory.)\n\nFloating Memory",
      abilities: [
        {
          id: "3oda2ha4dk-a1",
          kind: "card-resolution",
          text: "If target opponent's influence is greater than yours, recover 4. (A player's influence is equal to the total amount of cards in their hand and memory.)",
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
              kind: "recover",
              player: "controller",
              amount: 4,
            },
          },
        },
        {
          id: "3oda2ha4dk-a2",
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

export default fastCure;
