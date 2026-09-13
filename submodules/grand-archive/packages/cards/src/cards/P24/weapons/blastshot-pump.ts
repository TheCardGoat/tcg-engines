import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blastshotPump: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gmnmp5af09",
  slug: "blastshot-pump",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gmnmp5af09:face:default",
      catalogId: "gmnmp5af09",
      name: "Blastshot Pump",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)\n\n[Class Bonus] If combat damage would be dealt to a unit by an attack using Blastshot Pump, that damage is dealt to that unit and an additional unit you don't control instead.",
      abilities: [
        {
          id: "gmnmp5af09-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "gmnmp5af09-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If combat damage would be dealt to a unit by an attack using Blastshot Pump, that damage is dealt to that unit and an additional unit you don't control instead.",
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
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
                using: {
                  kind: "source",
                },
                combatDamage: true,
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "additional-unit",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "zone-of",
                      player: "each-opponent",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                          {
                            kind: "not-subject",
                            subject: {
                              kind: "event-recipient",
                            },
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "deal-damage",
                        source: {
                          kind: "event-source",
                        },
                        recipient: {
                          kind: "event-recipient",
                        },
                        amount: {
                          kind: "event-amount",
                        },
                      },
                      {
                        kind: "deal-damage",
                        source: {
                          kind: "event-source",
                        },
                        recipient: {
                          kind: "bound",
                          binding: "additional-unit",
                        },
                        amount: {
                          kind: "event-amount",
                        },
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default blastshotPump;
