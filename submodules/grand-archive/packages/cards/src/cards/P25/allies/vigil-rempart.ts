import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vigilRempart: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pc3zpkw43o",
  slug: "vigil-rempart",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pc3zpkw43o:face:default",
      catalogId: "pc3zpkw43o",
      name: "Vigil Rempart",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Vigil Rempart gets +2POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "pc3zpkw43o-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Vigil Rempart gets +2POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default vigilRempart;
