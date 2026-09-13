import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lacunasGrasp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w7annwvl5q",
  slug: "lacunas-grasp",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w7annwvl5q:face:default",
      catalogId: "w7annwvl5q",
      name: "Lacuna's Grasp",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Ciel Bonus] On Attack: If there are no cards in the attacker's intent, you may pay (X). X can't be more than the amount of omens you have. If you do, Lacuna's Grasp gets +XPOWER.",
      abilities: [
        {
          id: "w7annwvl5q-a1",
          kind: "triggered",
          text: "[Ciel Bonus] On Attack: If there are no cards in the attacker's intent, you may pay (X). X can't be more than the amount of omens you have. If you do, Lacuna's Grasp gets +XPOWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
              maximum: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["intent"],
                    host: {
                      kind: "event-attacker",
                    },
                    relationship: "intent-of",
                  },
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "pay",
                player: "controller",
                cost: {
                  kind: "pay-reserve",
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                    amount: {
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default lacunasGrasp;
