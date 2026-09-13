import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rumbleCoordinator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "U5Fns5U7He",
  slug: "rumble-coordinator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "U5Fns5U7He:face:default",
      catalogId: "U5Fns5U7He",
      name: "Rumble Coordinator",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Vigor (This unit wakes up at the beginning of your end phase.)\n\n[Class Bonus] Rumble Coordinator gets +1POWER for each static counter on it.\n\n[Class Bonus] On Death: If there were one or more static counters on Rumble Coordinator, draw a card into your memory.",
      abilities: [
        {
          id: "U5Fns5U7He-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor (This unit wakes up at the beginning of your end phase.)",
          keyword: {
            name: "vigor",
          },
        },
        {
          id: "U5Fns5U7He-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Rumble Coordinator gets +1POWER for each static counter on it.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: "static",
                },
              },
            },
          ],
        },
        {
          id: "U5Fns5U7He-a3",
          kind: "triggered",
          text: "[Class Bonus] On Death: If there were one or more static counters on Rumble Coordinator, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
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
                    kind: "event-source",
                  },
                  counter: "static",
                },
                operator: "gte",
                right: 1,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default rumbleCoordinator;
