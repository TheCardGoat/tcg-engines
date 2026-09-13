import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadeStriker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hVvsKqWsMl",
  slug: "shade-striker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hVvsKqWsMl:face:default",
      catalogId: "hVvsKqWsMl",
      name: "Shade Striker",
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
      rulesText: "Ambush (This ally may retaliate against attackers while not defending.)",
      abilities: [
        {
          id: "hVvsKqWsMl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush (This ally may retaliate against attackers while not defending.)",
          keyword: {
            name: "ambush",
          },
        },
      ],
    },
  },
};

export default shadeStriker;
