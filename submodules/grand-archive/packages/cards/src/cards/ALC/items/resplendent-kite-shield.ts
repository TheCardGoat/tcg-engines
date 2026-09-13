import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const resplendentKiteShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a5uhjxhkur",
  slug: "resplendent-kite-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a5uhjxhkur:face:default",
      catalogId: "a5uhjxhkur",
      name: "Resplendent Kite Shield",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Put a refinement counter on Resplendent Kite Shield. Class Bonus: Put two refinement counters on it instead.\n\nREST, Remove a refinement counter from Resplendent Kite Shield: Prevent the next 1 damage that would be dealt to your champion this turn. ",
      abilities: [
        {
          id: "a5uhjxhkur-a1",
          kind: "triggered",
          text: "On Enter: Put a refinement counter on Resplendent Kite Shield. Class Bonus: Put two refinement counters on it instead.",
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
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "event-subject",
              },
              counter: {
                named: "refinement",
              },
              amount: 2,
            },
            else: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "refinement",
              },
              amount: 1,
            },
          },
        },
        {
          id: "a5uhjxhkur-a2",
          kind: "activated",
          text: "REST, Remove a refinement counter from Resplendent Kite Shield: Prevent the next 1 damage that would be dealt to your champion this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                amount: 1,
              },
            ],
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 1,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default resplendentKiteShield;
