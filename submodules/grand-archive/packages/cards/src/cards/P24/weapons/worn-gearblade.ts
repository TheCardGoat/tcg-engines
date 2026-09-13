import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wornGearblade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r1o0qtb31x",
  slug: "worn-gearblade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r1o0qtb31x:face:default",
      catalogId: "r1o0qtb31x",
      name: "Worn Gearblade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] REST, Remove a durability counter from Worn Gearblade: Prevent the next 1 damage that would be dealt to target unit this turn.\n\nWhenever an Automaton ally you control dies, put a durability counter on Worn Gearblade.",
      abilities: [
        {
          id: "r1o0qtb31x-a1",
          kind: "activated",
          text: "[Class Bonus] REST, Remove a durability counter from Worn Gearblade: Prevent the next 1 damage that would be dealt to target unit this turn.",
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
                counter: "durability",
                amount: 1,
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
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
        {
          id: "r1o0qtb31x-a2",
          kind: "triggered",
          text: "Whenever an Automaton ally you control dies, put a durability counter on Worn Gearblade.",
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
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default wornGearblade;
