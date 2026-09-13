import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialAssassin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mwd3n9u8ej",
  slug: "imperial-assassin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mwd3n9u8ej:face:default",
      catalogId: "mwd3n9u8ej",
      name: "Imperial Assassin",
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
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight. Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "mwd3n9u8ej-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight. Apply this effect only if your champion’s class matches this card’s class.)",
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

export default imperialAssassin;
