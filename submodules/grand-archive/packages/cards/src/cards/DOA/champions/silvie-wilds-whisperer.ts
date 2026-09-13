import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvieWildsWhisperer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RfPP8h16Wv",
  slug: "silvie-wilds-whisperer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RfPP8h16Wv:face:default",
      catalogId: "RfPP8h16Wv",
      name: "Silvie, Wilds Whisperer",
      lineageName: "Silvie",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: The next Animal or Beast ally card you activate this turn enters the field with an additional buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "RfPP8h16Wv-a1",
          kind: "triggered",
          text: "On Enter: The next Animal or Beast ally card you activate this turn enters the field with an additional buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
              cause: {
                kind: "card-activation",
                controller: "controller",
              },
            },
            operation: {
              kind: "add-object-counters",
              counters: [
                {
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
            duration: {
              kind: "for-next-event",
              event: "object-entered-field",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default silvieWildsWhisperer;
