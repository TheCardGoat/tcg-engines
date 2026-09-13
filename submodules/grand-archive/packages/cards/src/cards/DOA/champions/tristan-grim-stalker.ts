import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanGrimStalker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "K5luT8aRzc",
  slug: "tristan-grim-stalker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "K5luT8aRzc:face:default",
      catalogId: "K5luT8aRzc",
      name: "Tristan, Grim Stalker",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "On Ally Hit: You may remove three preparation counters from Tristan. If you do, destroy the hit ally.\n\nAt the beginning of your end phase, if Tristan is awake, put a preparation counter on Tristan.",
      abilities: [
        {
          id: "K5luT8aRzc-a1",
          kind: "triggered",
          text: "On Ally Hit: You may remove three preparation counters from Tristan. If you do, destroy the hit ally.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
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
                  kind: "remove-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "preparation",
                  amount: 3,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "destroy",
                  subject: {
                    kind: "event-recipient",
                  },
                },
              ],
            },
          },
        },
        {
          id: "K5luT8aRzc-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, if Tristan is awake, put a preparation counter on Tristan.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "source",
              },
              state: "awake",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "preparation",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default tristanGrimStalker;
