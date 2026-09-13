import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ventusStaffOfZephyrs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5av43ehjdu",
  slug: "ventus-staff-of-zephyrs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5av43ehjdu:face:default",
      catalogId: "5av43ehjdu",
      name: "Ventus, Staff of Zephyrs",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "STAFF"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Whenever you activate a wind element Mage Spell, put a refinement counter on Ventus. \n\nREST, Remove a refinement counter from Ventus: Put an enlighten counter on your champion. \n\nREST, Remove three refinement counters from Ventus: Suppress target ally.",
      abilities: [
        {
          id: "5av43ehjdu-a1",
          kind: "triggered",
          text: "Whenever you activate a wind element Mage Spell, put a refinement counter on Ventus.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
              },
            },
          },
          effect: {
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
        {
          id: "5av43ehjdu-a2",
          kind: "activated",
          text: "REST, Remove a refinement counter from Ventus: Put an enlighten counter on your champion.",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
        {
          id: "5av43ehjdu-a3",
          kind: "activated",
          text: "REST, Remove three refinement counters from Ventus: Suppress target ally.",
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
                amount: 3,
              },
            ],
          },
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
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default ventusStaffOfZephyrs;
