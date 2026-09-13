import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eminentLethargy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GGRtLQgaYU",
  slug: "eminent-lethargy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GGRtLQgaYU:face:default",
      catalogId: "GGRtLQgaYU",
      name: "Eminent Lethargy",
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
      elements: ["EXALTED", "WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, players can’t declare attacks unless they pay (2) for each attack declaration.\n\nIf a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
      abilities: [
        {
          id: "GGRtLQgaYU-a1",
          kind: "card-resolution",
          text: "Until end of turn, players can’t declare attacks unless they pay (2) for each attack declaration.",
          effect: {
            kind: "rule-modification",
            mode: "add-cost",
            action: "attack",
            subject: {
              kind: "player",
              player: "each-player",
            },
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "GGRtLQgaYU-a2",
          kind: "card-resolution",
          text: "If a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field", "intent"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "end-phase",
              phase: "combat",
            },
          },
        },
      ],
    },
  },
};

export default eminentLethargy;
