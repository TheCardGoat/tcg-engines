import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intricateLongbow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1a49w5gmf7",
  slug: "intricate-longbow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1a49w5gmf7:face:default",
      catalogId: "1a49w5gmf7",
      name: "Intricate Longbow",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BOW"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 4,
      },
      rulesText:
        "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)\n\n[Class Bonus] [Level 2+] Intricate Longbow gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "1a49w5gmf7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "bow",
          },
        },
        {
          id: "1a49w5gmf7-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Intricate Longbow gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default intricateLongbow;
