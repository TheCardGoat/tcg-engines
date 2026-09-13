import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galewhisperRogue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wnyqmrcwda",
  slug: "galewhisper-rogue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wnyqmrcwda:face:default",
      catalogId: "wnyqmrcwda",
      name: "Galewhisper Rogue",
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
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "wnyqmrcwda-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "stealth",
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

export default galewhisperRogue;
