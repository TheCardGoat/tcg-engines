import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const soothingPotion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gnYM2V6TTw",
  slug: "soothing-potion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gnYM2V6TTw:face:default",
      catalogId: "gnYM2V6TTw",
      name: "Soothing Potion",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Brew — Two Herbs with the same name (You may sacrifice the listed objects rather than pay this card’s reserve cost.)\n\nSacrifice Soothing Potion: Draw a card and recover 3. If Soothing Potion was brewed, draw an additional card.",
      abilities: [
        {
          id: "gnYM2V6TTw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs with the same name (You may sacrifice the listed objects rather than pay this card’s reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
            nameConstraint: "same",
          },
        },
        {
          id: "gnYM2V6TTw-a2",
          kind: "activated",
          text: "Sacrifice Soothing Potion: Draw a card and recover 3. If Soothing Potion was brewed, draw an additional card.",
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
                kind: "sequence",
                effects: [
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                  {
                    kind: "recover",
                    player: "controller",
                    amount: 3,
                  },
                ],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "brewed",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default soothingPotion;
