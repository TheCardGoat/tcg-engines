import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const steelHalberd: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fvnvknj4dd",
  slug: "steel-halberd",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fvnvknj4dd:face:default",
      catalogId: "fvnvknj4dd",
      name: "Steel Halberd",
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
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Steel Halberd gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "fvnvknj4dd-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Steel Halberd gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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

export default steelHalberd;
