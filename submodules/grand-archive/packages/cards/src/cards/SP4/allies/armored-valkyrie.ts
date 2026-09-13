import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const armoredValkyrie: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zk96yd609g",
  slug: "armored-valkyrie",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zk96yd609g:face:default",
      catalogId: "zk96yd609g",
      name: "Armored Valkyrie",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)\n\n[Class Bonus] As long as Armored Valkyrie is retaliating, it gets +2 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "zk96yd609g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
          keyword: {
            name: "steadfast",
          },
        },
        {
          id: "zk96yd609g-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as Armored Valkyrie is retaliating, it gets +2 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default armoredValkyrie;
