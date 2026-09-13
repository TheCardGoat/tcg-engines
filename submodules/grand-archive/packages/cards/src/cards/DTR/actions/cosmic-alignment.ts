import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cosmicAlignment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b2buhbediq",
  slug: "cosmic-alignment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b2buhbediq:face:default",
      catalogId: "b2buhbediq",
      name: "Cosmic Alignment",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "The next time you would glimpse an amount this turn, draw that many cards instead.",
      abilities: [
        {
          id: "b2buhbediq-a1",
          kind: "card-resolution",
          text: "The next time you would glimpse an amount this turn, draw that many cards instead.",
          effect: {
            kind: "replacement",
            event: {
              name: "keyword-action-performed",
              action: "glimpse",
              actor: "controller",
            },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "event-amount",
                },
              },
            },
            duration: {
              kind: "for-next-event",
              event: "keyword-action-performed",
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

export default cosmicAlignment;
