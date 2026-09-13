import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cutthroatOperative: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s714OWbqi2",
  slug: "cutthroat-operative",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s714OWbqi2:face:default",
      catalogId: "s714OWbqi2",
      name: "Cutthroat Operative",
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
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Whenever you activate an attack card, if Cutthroat Operative has less than two buff counters on it, put a buff counter on it. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "s714OWbqi2-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate an attack card, if Cutthroat Operative has less than two buff counters on it, put a buff counter on it. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ATTACK"],
                },
              },
            },
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
                operator: "lt",
                right: 2,
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
        },
      ],
    },
  },
};

export default cutthroatOperative;
