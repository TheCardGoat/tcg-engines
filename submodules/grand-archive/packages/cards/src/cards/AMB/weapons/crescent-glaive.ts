import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crescentGlaive: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h7iz4xkbq1",
  slug: "crescent-glaive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h7iz4xkbq1:face:default",
      catalogId: "h7iz4xkbq1",
      name: "Crescent Glaive",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Crescent Glaive gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "h7iz4xkbq1-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Crescent Glaive gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
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

export default crescentGlaive;
