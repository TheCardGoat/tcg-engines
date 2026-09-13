import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const concealedMarksman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7fqr67duh1",
  slug: "concealed-marksman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7fqr67duh1:face:default",
      catalogId: "7fqr67duh1",
      name: "Concealed Marksman",
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
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] True Sight (This ally can attack units with stealth.)\n\nRanged 4 (As long as this unit is distant, its attacks get +4 POWER.) ",
      abilities: [
        {
          id: "7fqr67duh1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] True Sight (This ally can attack units with stealth.)",
          keyword: {
            name: "true-sight",
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
        {
          id: "7fqr67duh1-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 4 (As long as this unit is distant, its attacks get +4 POWER.)",
          keyword: {
            name: "ranged",
            value: 4,
          },
        },
      ],
    },
  },
};

export default concealedMarksman;
