import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainedSharpshooter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uhjxhkurfp",
  slug: "trained-sharpshooter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uhjxhkurfp:face:default",
      catalogId: "uhjxhkurfp",
      name: "Trained Sharpshooter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "uhjxhkurfp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "ranged",
            value: 2,
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

export default trainedSharpshooter;
