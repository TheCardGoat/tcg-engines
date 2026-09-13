import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const allianceGearshield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c8ljyevpmu",
  slug: "alliance-gearshield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c8ljyevpmu:face:default",
      catalogId: "c8ljyevpmu",
      name: "Alliance Gearshield",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +1 LIFE. Class Bonus: That ally also gets +2 POWER as long as they're retaliating. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "c8ljyevpmu-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "c8ljyevpmu-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +1 LIFE. Class Bonus: That ally also gets +2 POWER as long as they're retaliating. (Apply the additional effect only if your champion's class matches this card's class.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "linked-object",
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
            {
              kind: "continuous",
              subjects: {
                kind: "linked-object",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "champion-matches-source",
                    characteristic: "class",
                  },
                  {
                    kind: "object-state",
                    subject: {
                      kind: "linked-object",
                    },
                    state: "retaliating",
                  },
                ],
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default allianceGearshield;
