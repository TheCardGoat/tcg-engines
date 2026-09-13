import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const esteemedKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iabqeB0I6t",
  slug: "esteemed-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iabqeB0I6t:face:default",
      catalogId: "iabqeB0I6t",
      name: "Esteemed Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "iabqeB0I6t-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "intercept",
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

export default esteemedKnight;
