import type { CharacterCard } from "@tcg/lorcana-types";

export const mittensSassyStreetCat: CharacterCard = {
  abilities: [
    {
      id: "et6-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "et6-2",
      name: "NO THANKS NECESSARY Once",
      text: "NO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "3560af4d94b66ca33fed2fa534f5c8ee97513428",
  },
  franchise: "Bolt",
  fullName: "Mittens - Sassy Street Cat",
  id: "et6",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Mittens",
  set: "007",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
  version: "Sassy Street Cat",
  willpower: 5,
};
