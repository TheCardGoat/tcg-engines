import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainedHawk: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3TfIePpuZO",
  slug: "trained-hawk",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3TfIePpuZO:face:default",
      catalogId: "3TfIePpuZO",
      name: "Trained Hawk",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "True Sight (This ally can attack units with stealth.)\n\nVigor (This ally wakes up at the beginning of your end phase.)",
      abilities: [
        {
          id: "3TfIePpuZO-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This ally can attack units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
        {
          id: "3TfIePpuZO-a2",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor (This ally wakes up at the beginning of your end phase.)",
          keyword: {
            name: "vigor",
          },
        },
      ],
    },
  },
};

export default trainedHawk;
