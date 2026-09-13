import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intrepidHighwayman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WUAOMTZ7P2",
  slug: "intrepid-highwayman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WUAOMTZ7P2:face:default",
      catalogId: "WUAOMTZ7P2",
      name: "Intrepid Highwayman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Intercept (When your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nAs long as Intrepid Highwayman is retaliating, it gets +3 POWER.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "WUAOMTZ7P2-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (When your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "WUAOMTZ7P2-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Intrepid Highwayman is retaliating, it gets +3 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "retaliating",
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
        {
          id: "WUAOMTZ7P2-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default intrepidHighwayman;
