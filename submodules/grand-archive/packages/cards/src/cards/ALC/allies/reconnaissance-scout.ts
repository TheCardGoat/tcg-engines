import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reconnaissanceScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lwuupowx4p",
  slug: "reconnaissance-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lwuupowx4p:face:default",
      catalogId: "lwuupowx4p",
      name: "Reconnaissance Scout",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Fast Activation\n\nRanged 2\n\n[Class Bonus] On Enter: Another target unit you control becomes distant. Prevent the next 1 damage that would be dealt to that unit this turn.",
      abilities: [
        {
          id: "lwuupowx4p-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "lwuupowx4p-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "lwuupowx4p-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Another target unit you control becomes distant. Prevent the next 1 damage that would be dealt to that unit this turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
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
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
              {
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
            ],
          },
        },
      ],
    },
  },
};

export default reconnaissanceScout;
