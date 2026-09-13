import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perfectRepulsion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gwj4f15joh",
  slug: "perfect-repulsion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gwj4f15joh:face:default",
      catalogId: "gwj4f15joh",
      name: "Perfect Repulsion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time target unit you control would take exactly X damage this turn, prevent that damage, where X is the amount of cards in your memory. Draw a card if damage was prevented this way. (X is calculated only as this card resolves.)",
      abilities: [
        {
          id: "gwj4f15joh-a1",
          kind: "card-resolution",
          text: "The next time target unit you control would take exactly X damage this turn, prevent that damage, where X is the amount of cards in your memory. Draw a card if damage was prevented this way. (X is calculated only as this card resolves.)",
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
                relationship: "controlled-by",
                player: "controller",
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
                kind: "count",
                collection: {
                  zones: ["memory"],
                  player: "controller",
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "eq",
                right: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
            operation: {
              kind: "prevent",
              amount: {
                kind: "all",
              },
            },
            afterApply: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default perfectRepulsion;
