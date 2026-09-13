import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const titheProclamation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q8sdbzr5zs",
  slug: "tithe-proclamation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q8sdbzr5zs:face:default",
      catalogId: "q8sdbzr5zs",
      name: "Tithe Proclamation",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SCRIPTURE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\nEach player can't draw more than three cards each turn unless it's their first turn of the game.",
      abilities: [
        {
          id: "q8sdbzr5zs-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "q8sdbzr5zs-a2",
          kind: "static",
          staticKind: "effects",
          text: "Each player can't draw more than three cards each turn unless it's their first turn of the game.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-limit",
              action: "draw",
              subject: {
                kind: "player",
                player: "each-player",
              },
              amount: 3,
              condition: {
                kind: "player-turn-count",
                player: "event-actor",
                operator: "gte",
                value: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default titheProclamation;
