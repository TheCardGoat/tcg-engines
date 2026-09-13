import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suddenSteel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SSu2eQZFJV",
  slug: "sudden-steel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SSu2eQZFJV:face:default",
      catalogId: "SSu2eQZFJV",
      name: "Sudden Steel",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 5,
      },
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "SSu2eQZFJV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "efficiency",
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

export default suddenSteel;
