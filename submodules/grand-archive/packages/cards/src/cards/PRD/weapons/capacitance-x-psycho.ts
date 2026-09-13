import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const capacitanceXPsycho: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FjklZcbjPV",
  slug: "capacitance-x-psycho",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FjklZcbjPV:face:default",
      catalogId: "FjklZcbjPV",
      name: "Capacitance X Psycho",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SWORD"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "[Lorraine Bonus] As long as there are six or more arcane element cards in your banishment, you may activate this card from your material deck. If you do, it enters the field rested.\n\n[Lorraine Bonus] Non-combat damage dealt by sources you control is unpreventable.\n\nAs long as Capacitance X Psycho is awake, if a source you control would deal exactly 1 non-combat damage, it deals that much damage plus 1 instead.",
      abilities: [
        {
          id: "FjklZcbjPV-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Lorraine Bonus] As long as there are six or more arcane element cards in your banishment, you may activate this card from your material deck. If you do, it enters the field rested.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["ARCANE"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 6,
                },
              },
              activationResult: {
                entryState: {
                  state: "rested",
                  value: true,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "FjklZcbjPV-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Lorraine Bonus] Non-combat damage dealt by sources you control is unpreventable.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "prevent-damage",
              against: {
                kind: "each",
                collection: {
                  zones: ["field", "effects-stack"],
                  player: "controller",
                },
              },
              damageKind: "non-combat",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "FjklZcbjPV-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Capacitance X Psycho is awake, if a source you control would deal exactly 1 non-combat damage, it deals that much damage plus 1 instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                },
                combatDamage: false,
                amountComparison: {
                  left: {
                    kind: "event-amount",
                  },
                  operator: "eq",
                  right: 1,
                },
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 1,
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

export default capacitanceXPsycho;
