import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trivariateDream: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6g7x7tja9h",
  slug: "trivariate-dream",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6g7x7tja9h:face:default",
      catalogId: "6g7x7tja9h",
      name: "Trivariate Dream",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "(Aetherwing — Must be loaded to use for an attack and can’t be used with an attack card.)\n\n[Class Bonus] On Attack: If there are exactly three Aethercharge cards in the attacker's intent, this attack gets +3POWER.",
      abilities: [
        {
          id: "6g7x7tja9h-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Aetherwing — Must be loaded to use for an attack and can’t be used with an attack card.)",
          keyword: {
            name: "aetherwing",
          },
        },
        {
          id: "6g7x7tja9h-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If there are exactly three Aethercharge cards in the attacker's intent, this attack gets +3POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
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
                    filter: {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                  },
                },
                operator: "eq",
                right: 3,
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
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
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default trivariateDream;
