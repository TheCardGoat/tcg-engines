import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strappingConscript: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "csMiEObm2l",
  slug: "strapping-conscript",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "csMiEObm2l:face:default",
      catalogId: "csMiEObm2l",
      name: "Strapping Conscript",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Strapping Conscript gets +1 POWER and +1 LIFE. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "csMiEObm2l-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Strapping Conscript gets +1 POWER and +1 LIFE. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
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
                property: "life",
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

export default strappingConscript;
