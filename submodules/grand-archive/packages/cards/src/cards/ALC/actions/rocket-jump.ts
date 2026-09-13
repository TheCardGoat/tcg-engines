import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rocketJump: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rhlq2kkvoq",
  slug: "rocket-jump",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rhlq2kkvoq:face:default",
      catalogId: "rhlq2kkvoq",
      name: "Rocket Jump",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nTarget unit becomes distant. If that unit is defending, deal 4 damage to its attacker.",
      abilities: [
        {
          id: "rhlq2kkvoq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rhlq2kkvoq-a2",
          kind: "card-resolution",
          text: "Target unit becomes distant. If that unit is defending, deal 4 damage to its attacker.",
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
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "object-state",
                    state: "defending",
                  },
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "related",
                    subject: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    relation: "attacker",
                  },
                  amount: 4,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default rocketJump;
