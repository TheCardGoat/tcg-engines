import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stockedOutpost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AOMXEGeSQk",
  slug: "stocked-outpost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AOMXEGeSQk:face:default",
      catalogId: "AOMXEGeSQk",
      name: "Stocked Outpost",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {
        durability: 4,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nOn Enter: Draw a card into your memory.\n\nOn Destroy: If it's an opponent's turn, that opponent draws a card into their memory.\n",
      abilities: [
        {
          id: "AOMXEGeSQk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "AOMXEGeSQk-a2",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            to: "memory",
          },
        },
        {
          id: "AOMXEGeSQk-a3",
          kind: "triggered",
          text: "On Destroy: If it's an opponent's turn, that opponent draws a card into their memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-destroyed",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "turn-player",
              player: "opponent",
            },
            then: {
              kind: "draw",
              player: "turn-player",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default stockedOutpost;
