import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tuneUp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "chyfhweEro",
  slug: "tune-up",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "chyfhweEro:face:default",
      catalogId: "chyfhweEro",
      name: "Tune Up",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 2. If you control an Automaton ally, recover 4 instead.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "chyfhweEro-a1",
          kind: "card-resolution",
          text: "Recover 2. If you control an Automaton ally, recover 4 instead.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 4,
            },
            else: {
              kind: "recover",
              player: "controller",
              amount: 2,
            },
          },
        },
        {
          id: "chyfhweEro-a2",
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

export default tuneUp;
