import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seasonedArcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fvyhuxzjk8",
  slug: "seasoned-archer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fvyhuxzjk8:face:default",
      catalogId: "fvyhuxzjk8",
      name: "Seasoned Archer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3 POWER. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "fvyhuxzjk8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3 POWER. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "ranged",
            value: 3,
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

export default seasonedArcher;
