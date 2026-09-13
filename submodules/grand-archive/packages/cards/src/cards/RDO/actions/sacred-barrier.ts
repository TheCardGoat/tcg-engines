import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sacredBarrier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hYDqthNDpB",
  slug: "sacred-barrier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hYDqthNDpB:face:default",
      catalogId: "hYDqthNDpB",
      name: "Sacred Barrier",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time each ally would be dealt non-combat damage this turn, prevent 4 of that damage.",
      abilities: [
        {
          id: "hYDqthNDpB-a1",
          kind: "card-resolution",
          text: "The next time each ally would be dealt non-combat damage this turn, prevent 4 of that damage.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              combatDamage: false,
            },
            limit: {
              count: 1,
              per: "object",
            },
            operation: {
              kind: "prevent",
              amount: 4,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default sacredBarrier;
