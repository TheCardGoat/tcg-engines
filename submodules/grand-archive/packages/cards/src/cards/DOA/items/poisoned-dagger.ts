import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisonedDagger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0D6AfZyKXh",
  slug: "poisoned-dagger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0D6AfZyKXh:face:default",
      catalogId: "0D6AfZyKXh",
      name: "Poisoned Dagger",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Poisoned Dagger enters the field rested.\n\nREST, Banish Poisoned Dagger: Deal 1 damage to target unit. Class Bonus: Until end of turn, if that unit were to take damage, it takes that much damage plus 1 instead.",
      abilities: [
        {
          id: "0D6AfZyKXh-a1",
          kind: "static",
          staticKind: "effects",
          text: "Poisoned Dagger enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "0D6AfZyKXh-a2",
          kind: "activated",
          text: "REST, Banish Poisoned Dagger: Deal 1 damage to target unit. Class Bonus: Until end of turn, if that unit were to take damage, it takes that much damage plus 1 instead.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 1,
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
                      binding: "target-1",
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

export default poisonedDagger;
