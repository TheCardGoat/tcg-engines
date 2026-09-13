import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const polishingFlourish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "D79VKF2uOg",
  slug: "polishing-flourish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "D79VKF2uOg:face:default",
      catalogId: "D79VKF2uOg",
      name: "Polishing Flourish",
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
        "Remove all sheen counters from units you control.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "D79VKF2uOg-a1",
          kind: "card-resolution",
          text: "Remove all sheen counters from units you control.",
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            counter: {
              named: "sheen",
            },
            amount: {
              kind: "all",
            },
          },
        },
        {
          id: "D79VKF2uOg-a2",
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

export default polishingFlourish;
