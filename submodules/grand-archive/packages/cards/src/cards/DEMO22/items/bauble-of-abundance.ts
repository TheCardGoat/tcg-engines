import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baubleOfAbundance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Z9TCpaMJTc",
  slug: "bauble-of-abundance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Z9TCpaMJTc:face:default",
      catalogId: "Z9TCpaMJTc",
      name: "Bauble of Abundance",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Banish Bauble of Abundance: Each player draws a card.",
      abilities: [
        {
          id: "Z9TCpaMJTc-a1",
          kind: "activated",
          text: "Banish Bauble of Abundance: Each player draws a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "draw",
            player: "each-player",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default baubleOfAbundance;
