import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistyWhispertail: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tJAIMX3C4R",
  slug: "misty-whispertail",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tJAIMX3C4R:face:default",
      catalogId: "tJAIMX3C4R",
      name: "Misty Whispertail",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "ANIMAL", "MOUSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Sacrifice Misty Whispertail: If Misty Whispertail was not ephemeral, draw a card into your memory. Otherwise, recover 3.",
      abilities: [
        {
          id: "tJAIMX3C4R-a1",
          kind: "activated",
          text: "Sacrifice Misty Whispertail: If Misty Whispertail was not ephemeral, draw a card into your memory. Otherwise, recover 3.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                basis: "last-known",
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
            else: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default mistyWhispertail;
