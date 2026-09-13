import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessArbalest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m4o98vn1vo",
  slug: "winbless-arbalest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m4o98vn1vo:face:default",
      catalogId: "m4o98vn1vo",
      name: "Winbless Arbalest",
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
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\n[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "m4o98vn1vo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "m4o98vn1vo-a2",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "vigor",
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

export default winblessArbalest;
