import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tacticalRetreat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sn0ye3aebj",
  slug: "tactical-retreat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sn0ye3aebj:face:default",
      catalogId: "sn0ye3aebj",
      name: "Tactical Retreat",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant. If that unit is defending, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "sn0ye3aebj-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. If that unit is defending, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "object-state",
                    state: "defending",
                  },
                },
                then: {
                  kind: "end-phase",
                  phase: "combat",
                },
              },
            ],
          },
        },
        {
          id: "sn0ye3aebj-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default tacticalRetreat;
