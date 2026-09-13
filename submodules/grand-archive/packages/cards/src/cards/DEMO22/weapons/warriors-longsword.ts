import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const warriorsLongsword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jF1VuIR7a6",
  slug: "warriors-longsword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jF1VuIR7a6:face:default",
      catalogId: "jF1VuIR7a6",
      name: "Warrior's Longsword",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Warrior's Longsword gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "jF1VuIR7a6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Warrior's Longsword gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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

export default warriorsLongsword;
