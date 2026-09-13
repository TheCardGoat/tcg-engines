import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const syntheticCore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w0y6isxy5l",
  slug: "synthetic-core",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w0y6isxy5l:face:default",
      catalogId: "w0y6isxy5l",
      name: "Synthetic Core",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever a non-token Automaton ally you control dies, you may banish Synthetic Core. If you do, return that ally to your memory.",
      abilities: [
        {
          id: "w0y6isxy5l-a1",
          kind: "triggered",
          text: "Whenever a non-token Automaton ally you control dies, you may banish Synthetic Core. If you do, return that ally to your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                    {
                      kind: "token",
                      value: false,
                    },
                  ],
                },
                bindAs: "died-automaton",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  bindSucceededAs: "source-banished",
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "source-banished",
                  },
                  then: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "died-automaton",
                    },
                    from: "graveyard",
                    destination: {
                      zone: "memory",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default syntheticCore;
