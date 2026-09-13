import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strikeOfSingularity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AMv1u54B2s",
  slug: "strike-of-singularity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AMv1u54B2s:face:default",
      catalogId: "AMv1u54B2s",
      name: "Strike of Singularity",
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
      elements: ["LUXEM"],
      stats: {
        power: 4,
      },
      rulesText:
        '[Class Bonus] As long as the attacker is attacking a unit controlled by a player with no cards in their hand, Strike of Singularity has "If this attack would deal damage, it deals double that damage instead." ',
      abilities: [
        {
          id: "AMv1u54B2s-a1",
          kind: "static",
          staticKind: "effects",
          text: '[Class Bonus] As long as the attacker is attacking a unit controlled by a player with no cards in their hand, Strike of Singularity has "If this attack would deal damage, it deals double that damage instead."',
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
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "event-attacker",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-d0ekj-a1",
                  kind: "static",
                  staticKind: "effects",
                  text: "If this attack would deal damage, it deals double that damage instead.",
                  effects: [
                    {
                      kind: "replacement",
                      event: {
                        name: "damage-dealt",
                        using: {
                          kind: "source",
                        },
                        combatDamage: true,
                      },
                      operation: {
                        kind: "modify-amount",
                        operation: "multiply",
                        amount: 2,
                      },
                      duration: {
                        kind: "this-attack",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default strikeOfSingularity;
