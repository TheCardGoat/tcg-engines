import type { CharacterCard } from "@tcg/lorcana-types";

export const zipperAstuteDecoy: CharacterCard = {
  id: "n08",
  cardType: "character",
  name: "Zipper",
  version: "Astute Decoy",
  fullName: "Zipper - Astute Decoy",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52eab6990d88727659a47fd96cbda02e69229a99",
  },
  abilities: [
    {
      id: "n08-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "n08-2",
      type: "triggered",
      name: "RUN INTERFERENCE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 1,
      },
      text: "RUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
