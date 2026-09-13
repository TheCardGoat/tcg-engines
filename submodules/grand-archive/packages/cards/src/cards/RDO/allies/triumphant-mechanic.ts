import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const triumphantMechanic: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tQTQqCnaZU",
  slug: "triumphant-mechanic",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tQTQqCnaZU:face:default",
      catalogId: "tQTQqCnaZU",
      name: "Triumphant Mechanic",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "On Enter: If you control three or more tokens, draw a card into your memory. \n\nOn Attack: If you control three or more tokens, recover 3.",
      abilities: [
        {
          id: "tQTQqCnaZU-a1",
          kind: "triggered",
          text: "On Enter: If you control three or more tokens, draw a card into your memory.",
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
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
                operator: "gte",
                right: 3,
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
          id: "tQTQqCnaZU-a2",
          kind: "triggered",
          text: "On Attack: If you control three or more tokens, recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
                operator: "gte",
                right: 3,
              },
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default triumphantMechanic;
