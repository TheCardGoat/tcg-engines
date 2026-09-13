import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vigilantSentry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "72rfgveirp",
  slug: "vigilant-sentry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "72rfgveirp:face:default",
      catalogId: "72rfgveirp",
      name: "Vigilant Sentry",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Taunt (While awake, this unit must be targeted before other units you control during your opponents’ attack declarations if able.)",
      abilities: [
        {
          id: "72rfgveirp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt (While awake, this unit must be targeted before other units you control during your opponents’ attack declarations if able.)",
          keyword: {
            name: "taunt",
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

export default vigilantSentry;
