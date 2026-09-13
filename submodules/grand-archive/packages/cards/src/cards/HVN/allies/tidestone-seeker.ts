import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidestoneSeeker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fv1sjj2cgs",
  slug: "tidestone-seeker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fv1sjj2cgs:face:default",
      catalogId: "fv1sjj2cgs",
      name: "Tidestone Seeker",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "fv1sjj2cgs-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default tidestoneSeeker;
