import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const auspiciousFeast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k0sln8vnuo",
  slug: "auspicious-feast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k0sln8vnuo:face:default",
      catalogId: "k0sln8vnuo",
      name: "Auspicious Feast",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Each player recovers 4.",
      abilities: [
        {
          id: "k0sln8vnuo-a1",
          kind: "card-resolution",
          text: "Each player recovers 4.",
          effect: {
            kind: "recover",
            player: "each-player",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default auspiciousFeast;
