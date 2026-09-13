import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crimsonTear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9q1wl8ao8b",
  slug: "crimson-tear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9q1wl8ao8b:face:default",
      catalogId: "9q1wl8ao8b",
      name: "Crimson Tear",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Level 1+] As long as Crimson Tear is attacking or retaliating against a Human, Crimson Tear gets +1 POWER. \n\n[Level 2+] Whenever you activate a Reaction card that targets Crimson Tear, draw a card into your memory. Then if it's not your turn, wake up Crimson Tear. ",
      abilities: [
        {
          id: "9q1wl8ao8b-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] As long as Crimson Tear is attacking or retaliating against a Human, Crimson Tear gets +1 POWER.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
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
              condition: {
                kind: "any",
                conditions: [
                  {
                    kind: "combat-relation",
                    relation: "attacking",
                    subject: {
                      kind: "source",
                    },
                    otherFilter: {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  },
                  {
                    kind: "combat-relation",
                    relation: "retaliating-against",
                    subject: {
                      kind: "source",
                    },
                    otherFilter: {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  },
                ],
              },
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "9q1wl8ao8b-a2",
          kind: "triggered",
          text: "[Level 2+] Whenever you activate a Reaction card that targets Crimson Tear, draw a card into your memory. Then if it's not your turn, wake up Crimson Tear.",
          trigger: {
            kind: "event",
            event: {
              name: "stack-item-targets-declared",
              actor: "controller",
              itemTypes: ["card-activation"],
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["REACTION"],
                },
              },
              recipient: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "turn-player",
                  player: "opponent",
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default crimsonTear;
