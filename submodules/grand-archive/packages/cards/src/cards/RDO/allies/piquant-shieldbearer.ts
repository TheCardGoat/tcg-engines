import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const piquantShieldbearer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Cvvvxlf0hi",
  slug: "piquant-shieldbearer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Cvvvxlf0hi:face:default",
      catalogId: "Cvvvxlf0hi",
      name: "Piquant Shieldbearer",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Taunt (While awake, this unit must be targeted before other objects you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "Cvvvxlf0hi-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this unit must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
      ],
    },
  },
};

export default piquantShieldbearer;
