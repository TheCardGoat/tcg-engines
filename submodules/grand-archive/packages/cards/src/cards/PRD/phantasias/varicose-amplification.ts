import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const varicoseAmplification: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Tt2Ew9RmIt",
  slug: "varicose-amplification",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Tt2Ew9RmIt:face:default",
      catalogId: "Tt2Ew9RmIt",
      name: "Varicose Amplification",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nWhenever an amount of damage is dealt to your champion, put that many blood counters on Varicose Amplification.\n\nAt the beginning of your main phase, sacrifice Varicose Amplification and empower 3+X, where X is the amount of blood counters that was on Varicose Amplification.",
      abilities: [
        {
          id: "Tt2Ew9RmIt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        {
          id: "Tt2Ew9RmIt-a2",
          kind: "triggered",
          text: "Whenever an amount of damage is dealt to your champion, put that many blood counters on Varicose Amplification.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "blood",
            },
            amount: {
              kind: "event-amount",
            },
          },
        },
        {
          id: "Tt2Ew9RmIt-a3",
          kind: "triggered",
          text: "At the beginning of your main phase, sacrifice Varicose Amplification and empower 3+X, where X is the amount of blood counters that was on Varicose Amplification.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "main",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "blood",
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    3,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default varicoseAmplification;
