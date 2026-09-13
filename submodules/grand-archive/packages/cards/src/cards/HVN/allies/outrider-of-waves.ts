import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const outriderOfWaves: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rltyxefm80",
  slug: "outrider-of-waves",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rltyxefm80:face:default",
      catalogId: "rltyxefm80",
      name: "Outrider of Waves",
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
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText: "Ranged 2 (As long as this unit is distant, its attacks get +2 power.)",
      abilities: [
        {
          id: "rltyxefm80-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 power.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
      ],
    },
  },
};

export default outriderOfWaves;
