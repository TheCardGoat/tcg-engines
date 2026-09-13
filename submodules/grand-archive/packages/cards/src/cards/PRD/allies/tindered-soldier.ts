import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tinderedSoldier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KEhmWGivJp",
  slug: "tindered-soldier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KEhmWGivJp:face:default",
      catalogId: "KEhmWGivJp",
      name: "Tindered Soldier",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Whenever you discard a fire element card, if there are no buff counters on Tindered Soldier, put a buff counter on Tindered Soldier. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "KEhmWGivJp-a1",
          kind: "triggered",
          text: "Whenever you discard a fire element card, if there are no buff counters on Tindered Soldier, put a buff counter on Tindered Soldier. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-discarded",
              actor: "controller",
              subject: {
                kind: "event-object",
                owner: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
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

export default tinderedSoldier;
