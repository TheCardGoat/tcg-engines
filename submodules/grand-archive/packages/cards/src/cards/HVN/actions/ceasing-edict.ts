import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ceasingEdict: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4f3bi5lohu",
  slug: "ceasing-edict",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4f3bi5lohu:face:default",
      catalogId: "4f3bi5lohu",
      name: "Ceasing Edict",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as your Shifting Currents face South, this card costs 2 less to activate.\n\n[Kongming Bonus] If a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
      abilities: [
        {
          id: "4f3bi5lohu-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face South, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4f3bi5lohu-a2",
          kind: "card-resolution",
          text: "[Kongming Bonus] If a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
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

export default ceasingEdict;
