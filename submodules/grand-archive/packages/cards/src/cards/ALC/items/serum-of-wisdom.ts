import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const serumOfWisdom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bae3z4pyx8",
  slug: "serum-of-wisdom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bae3z4pyx8:face:default",
      catalogId: "bae3z4pyx8",
      name: "Serum of Wisdom",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — Three Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.) \n\nSacrifice Serum of Wisdom: Glimpse 3. Draw a card into your memory.",
      abilities: [
        {
          id: "bae3z4pyx8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Three Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 3,
              },
            ],
          },
        },
        {
          id: "bae3z4pyx8-a2",
          kind: "activated",
          text: "Sacrifice Serum of Wisdom: Glimpse 3. Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 3,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default serumOfWisdom;
