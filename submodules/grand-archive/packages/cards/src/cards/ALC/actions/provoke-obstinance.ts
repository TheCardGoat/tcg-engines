import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const provokeObstinance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "16r0zadf9q",
  slug: "provoke-obstinance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "16r0zadf9q:face:default",
      catalogId: "16r0zadf9q",
      name: "Provoke Obstinance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL", "REACTION"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Whenever you activate this card, if there's exactly one target for its activation, draw a card into your memory.\n\nUp to five target objects you control gain spellshroud until end of turn. Prevent the next 2 damage that would be dealt to each of those targets this turn if they're units.",
      abilities: [
        {
          id: "16r0zadf9q-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate this card, if there's exactly one target for its activation, draw a card into your memory.",
          functionalZones: ["effects-stack"],
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
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
                  kind: "target-count",
                  ability: "event-stack-item",
                },
                operator: "eq",
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
        {
          id: "16r0zadf9q-a2",
          kind: "card-resolution",
          text: "Up to five target objects you control gain spellshroud until end of turn. Prevent the next 2 damage that would be dealt to each of those targets this turn if they're units.",
          targets: [
            {
              id: "target-objects",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 5,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-objects",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
                  },
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "bound-object",
                    binding: "target-objects",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                operation: {
                  kind: "prevent",
                },
                capacity: {
                  amount: 2,
                  scope: "per-object",
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

export default provokeObstinance;
