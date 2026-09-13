import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanFrozenShunt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Fkpr1hCUGF",
  slug: "aenean-frozen-shunt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Fkpr1hCUGF:face:default",
      catalogId: "Fkpr1hCUGF",
      name: "Aenean Frozen Shunt",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "If a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)\n\n[Class Bonus] [Level 4+] Draw a card into your memory.",
      abilities: [
        {
          id: "Fkpr1hCUGF-a1",
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
        {
          id: "Fkpr1hCUGF-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 4+] Draw a card into your memory.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 4,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default aeneanFrozenShunt;
