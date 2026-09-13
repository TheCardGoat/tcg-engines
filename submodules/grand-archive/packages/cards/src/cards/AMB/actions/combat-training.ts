import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const combatTraining: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3bxtj3te9i",
  slug: "combat-training",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3bxtj3te9i:face:default",
      catalogId: "3bxtj3te9i",
      name: "Combat Training",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target Warrior ally's next attack this turn gets +2 POWER. If that ally is unique, their next attack this turn gets +3 POWER instead.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "3bxtj3te9i-a1",
          kind: "card-resolution",
          text: "Target Warrior ally's next attack this turn gets +2 POWER. If that ally is unique, their next attack this turn gets +3 POWER instead.",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["WARRIOR"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "supertype",
                oneOf: ["UNIQUE"],
              },
            },
            then: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "attack-declared",
                  subject: {
                    kind: "bound-object",
                    binding: "target-1",
                  },
                },
              },
              limit: 1,
              expires: {
                kind: "this-turn",
              },
              effect: {
                kind: "continuous",
                subjects: {
                  kind: "current-attack",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-attack",
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
                  amount: 3,
                },
              },
            },
            else: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "attack-declared",
                  subject: {
                    kind: "bound-object",
                    binding: "target-1",
                  },
                },
              },
              limit: 1,
              expires: {
                kind: "this-turn",
              },
              effect: {
                kind: "continuous",
                subjects: {
                  kind: "current-attack",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-attack",
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
                  amount: 2,
                },
              },
            },
          },
        },
        {
          id: "3bxtj3te9i-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default combatTraining;
