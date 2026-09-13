import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enfeebledDagger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "idpdon8f0h",
  slug: "enfeebled-dagger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "idpdon8f0h:face:default",
      catalogId: "idpdon8f0h",
      name: "Enfeebled Dagger",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DISTORTION", "DAGGER"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Banish Enfeebled Dagger: Deal 1 damage to target unit. Class Bonus: Until end of turn, if that unit would deal damage, it deals that much damage minus 3 instead.",
      abilities: [
        {
          id: "idpdon8f0h-a1",
          kind: "activated",
          text: "Banish Enfeebled Dagger: Deal 1 damage to target unit. Class Bonus: Until end of turn, if that unit would deal damage, it deals that much damage minus 3 instead.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-unit",
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
                    subject: {
                      kind: "bound-object",
                      binding: "target-unit",
                    },
                  },
                  operation: {
                    kind: "modify-amount",
                    operation: "subtract",
                    amount: 3,
                    minimumResult: 0,
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

export default enfeebledDagger;
