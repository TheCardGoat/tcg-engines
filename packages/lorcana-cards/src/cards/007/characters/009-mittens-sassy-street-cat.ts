import type { CharacterCard } from "@tcg/lorcana-types";

export const mittensSassyStreetCat: CharacterCard = {
  id: "et6",
  cardType: "character",
  name: "Mittens",
  version: "Sassy Street Cat",
  fullName: "Mittens - Sassy Street Cat",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 9,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3560af4d94b66ca33fed2fa534f5c8ee97513428",
  },
  abilities: [
    {
      id: "et6-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "et6-2",
      type: "triggered",
      name: "NO THANKS NECESSARY Once",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "NO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
