import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bubbleMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0n0DM1T9gz",
  slug: "bubble-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0n0DM1T9gz:face:default",
      catalogId: "0n0DM1T9gz",
      name: "Bubble Mage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: Rest target unit. Class Bonus: Until end of turn, if that unit would take damage, it takes that much damage plus 1 instead. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "0n0DM1T9gz-a1",
          kind: "triggered",
          text: "On Enter: Rest target unit. Class Bonus: Until end of turn, if that unit would take damage, it takes that much damage plus 1 instead. (Apply the additional effect only if your champion's class matches this card's class.)",
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
              id: "target-unit",
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
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-unit",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "replacement",
                  event: {
                    name: "damage-dealt",
                    recipient: {
                      kind: "bound-object",
                      binding: "target-unit",
                    },
                  },
                  operation: {
                    kind: "modify-amount",
                    operation: "add",
                    amount: 1,
                  },
                  duration: {
                    kind: "this-turn",
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

export default bubbleMage;
