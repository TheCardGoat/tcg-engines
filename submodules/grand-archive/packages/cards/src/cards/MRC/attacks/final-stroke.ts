import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const finalStroke: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ekkjn37cx6",
  slug: "final-stroke",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ekkjn37cx6:face:default",
      catalogId: "ekkjn37cx6",
      name: "Final Stroke",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 5,
      },
      rulesText:
        "Prepare 3\n\n[Class Bonus] On Champion Hit: If Final Stroke was prepared and there are twenty or more damage counters on the hit champion, destroy the hit champion.",
      abilities: [
        {
          id: "ekkjn37cx6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 3",
          keyword: {
            name: "prepare",
            value: 3,
          },
        },
        {
          id: "ekkjn37cx6-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: If Final Stroke was prepared and there are twenty or more damage counters on the hit champion, destroy the hit champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
              kind: "all",
              conditions: [
                {
                  kind: "activation-state",
                  state: "prepared",
                },
                {
                  kind: "has-counter",
                  subject: {
                    kind: "event-recipient",
                  },
                  counter: "damage",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "event-recipient",
                      },
                      counter: "damage",
                    },
                    operator: "gte",
                    right: 20,
                  },
                },
              ],
            },
            then: {
              kind: "destroy",
              subject: {
                kind: "event-recipient",
              },
            },
          },
        },
      ],
    },
  },
};

export default finalStroke;
