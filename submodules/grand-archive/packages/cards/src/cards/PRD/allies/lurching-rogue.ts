import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lurchingRogue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8tYVFYnK0T",
  slug: "lurching-rogue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8tYVFYnK0T:face:default",
      catalogId: "8tYVFYnK0T",
      name: "Lurching Rogue",
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
        life: 3,
      },
      rulesText:
        "Ambush (This ally may retaliate against attackers while not defending.)\n\n[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "8tYVFYnK0T-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush (This ally may retaliate against attackers while not defending.)",
          keyword: {
            name: "ambush",
          },
        },
        {
          id: "8tYVFYnK0T-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
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

export default lurchingRogue;
