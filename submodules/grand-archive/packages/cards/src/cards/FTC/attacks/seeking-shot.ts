import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seekingShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "88zq9ox7u6",
  slug: "seeking-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "88zq9ox7u6:face:default",
      catalogId: "88zq9ox7u6",
      name: "Seeking Shot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BOW"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Level 2+] True Sight\n\n[Class Bonus] Seeking Shot can't be retaliated.\n\nAs long as the attacker is attacking a Human ally, Seeking Shot gets +3 POWER.",
      abilities: [
        {
          id: "88zq9ox7u6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] True Sight",
          keyword: {
            name: "true-sight",
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
        },
        {
          id: "88zq9ox7u6-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Seeking Shot can't be retaliated.",
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
              mode: "forbid",
              action: "retaliate",
              against: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "88zq9ox7u6-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as the attacker is attacking a Human ally, Seeking Shot gets +3 POWER.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default seekingShot;
