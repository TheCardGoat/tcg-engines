import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const singedEmotions: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TieUdzJ2B2",
  slug: "singed-emotions",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TieUdzJ2B2:face:default",
      catalogId: "TieUdzJ2B2",
      name: "Singed Emotions",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Until the beginning of your next turn, whenever a champion levels up, deal 4 damage to that champion.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "TieUdzJ2B2-a1",
          kind: "card-resolution",
          text: "Until the beginning of your next turn, whenever a champion levels up, deal 4 damage to that champion.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "champion-leveled-up",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "event-subject",
              },
              amount: 4,
            },
            expires: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
          },
        },
        {
          id: "TieUdzJ2B2-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default singedEmotions;
