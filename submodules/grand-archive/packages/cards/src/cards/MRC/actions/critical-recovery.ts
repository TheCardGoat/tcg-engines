import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const criticalRecovery: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rx6p3p5iqi",
  slug: "critical-recovery",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rx6p3p5iqi:face:default",
      catalogId: "rx6p3p5iqi",
      name: "Critical Recovery",
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
        "Remove all temporary damage from target ally. If that ally is an Automaton, put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "rx6p3p5iqi-a1",
          kind: "card-resolution",
          text: "Remove all temporary damage from target ally. If that ally is an Automaton, put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "damage",
                counterScope: "temporary",
                amount: {
                  kind: "all",
                },
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
                    kind: "subtype",
                    oneOf: ["AUTOMATON"],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "event-subject",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default criticalRecovery;
