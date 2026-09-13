import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const atmosShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> =
  {
    canonicalId: "80yu75k0hl",
    slug: "atmos-shield",
    definitionKind: "token-representation",
    layout: {
      kind: "single-faced",
      face: {
        id: "80yu75k0hl:face:default",
        catalogId: "80yu75k0hl",
        name: "Atmos Shield",
        cost: {
          kind: "reserve",
          amount: 1,
        },
        typeLine: {
          supertypes: [],
          types: ["ALLY"],
          classes: ["GUARDIAN"],
          subtypes: ["GUARDIAN", "AUTOMATON"],
        },
        elements: ["NEOS"],
        stats: {
          power: 0,
          life: 2,
        },
        rulesText:
          "REST: The next time target neos element unit would take non-combat damage this turn, prevent 2 of that damage.\n\nWhenever another neos element unit you control is targeted for an attack, you may change the target of that attack to this ally.",
        abilities: [
          {
            id: "80yu75k0hl-a1",
            kind: "activated",
            text: "REST: The next time target neos element unit would take non-combat damage this turn, prevent 2 of that damage.",
            activation: "ability",
            cost: {
              kind: "rest",
              subject: {
                kind: "source",
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
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "element",
                        oneOf: ["NEOS"],
                      },
                    ],
                  },
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
                combatDamage: false,
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "for-next-event",
                event: "damage-dealt",
                expires: {
                  kind: "this-turn",
                },
              },
            },
          },
          {
            id: "80yu75k0hl-a2",
            kind: "triggered",
            text: "Whenever another neos element unit you control is targeted for an attack, you may change the target of that attack to this ally.",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "element",
                        oneOf: ["NEOS"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
            },
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "retarget",
                subject: {
                  kind: "current-attack",
                },
                chooser: "controller",
                newTarget: {
                  kind: "source",
                },
              },
            },
          },
        ],
      },
    },
  };

export default atmosShield;
