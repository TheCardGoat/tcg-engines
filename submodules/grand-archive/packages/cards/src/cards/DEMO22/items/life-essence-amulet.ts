import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lifeEssenceAmulet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1XegCUjBnY",
  slug: "life-essence-amulet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1XegCUjBnY:face:default",
      catalogId: "1XegCUjBnY",
      name: "Life Essence Amulet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever an ally you control dies while it's not your turn, you may banish Life Essence Amulet. If you do, draw a card.",
      abilities: [
        {
          id: "1XegCUjBnY-a1",
          kind: "triggered",
          text: "Whenever an ally you control dies while it's not your turn, you may banish Life Essence Amulet. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              condition: {
                kind: "turn-player",
                player: "opponent",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default lifeEssenceAmulet;
