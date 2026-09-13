import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const performanceEnthusiast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FXPxYpv8nV",
  slug: "performance-enthusiast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FXPxYpv8nV:face:default",
      catalogId: "FXPxYpv8nV",
      name: "Performance Enthusiast",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RESONATOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Whenever you activate a Harmony or Melody card, if there are no buff counters on Performance Enthusiast, put a buff counter on Performance Enthusiast. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "FXPxYpv8nV-a1",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, if there are no buff counters on Performance Enthusiast, put a buff counter on Performance Enthusiast. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default performanceEnthusiast;
