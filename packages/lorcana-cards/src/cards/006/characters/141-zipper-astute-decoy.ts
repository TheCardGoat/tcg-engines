import type { CharacterCard } from "@tcg/lorcana-types";

export const zipperAstuteDecoy: CharacterCard = {
  abilities: [
    {
      id: "n08-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "n08-2",
      name: "RUN INTERFERENCE",
      text: "RUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "52eab6990d88727659a47fd96cbda02e69229a99",
  },
  franchise: "Rescue Rangers",
  fullName: "Zipper - Astute Decoy",
  id: "n08",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Zipper",
  set: "006",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Astute Decoy",
  willpower: 2,
};
