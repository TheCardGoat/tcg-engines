import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const languidToadtroll: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pfavgpsj3r",
  slug: "languid-toadtroll",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pfavgpsj3r:face:default",
      catalogId: "pfavgpsj3r",
      name: "Languid Toadtroll",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FROG"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 6,
      },
      rulesText:
        "Hindered (This ally enters the field rested.)\n\nTaunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "pfavgpsj3r-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "pfavgpsj3r-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
      ],
    },
  },
};

export default languidToadtroll;
