import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glimmerEssenceAmulet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dy4urpjbjm",
  slug: "glimmer-essence-amulet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dy4urpjbjm:face:default",
      catalogId: "dy4urpjbjm",
      name: "Glimmer Essence Amulet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever a phantasia you control is destroyed while it's not your turn, you may banish Glimmer Essence Amulet. If you do, draw a card.",
      abilities: [
        {
          id: "dy4urpjbjm-a1",
          kind: "triggered",
          text: "Whenever a phantasia you control is destroyed while it's not your turn, you may banish Glimmer Essence Amulet. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-destroyed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "turn-player",
                  player: "controller",
                },
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
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default glimmerEssenceAmulet;
