import type { CharacterCard } from "@tcg/lorcana-types";

export const scarEerilyPrepared: CharacterCard = {
  id: "1rg",
  cardType: "character",
  name: "Scar",
  version: "Eerily Prepared",
  fullName: "Scar - Eerily Prepared",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e4aaeaa0e0dad921e2728069209736326c66473f",
  },
  abilities: [
    {
      id: "1rg-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "1rg-2",
      type: "triggered",
      name: "SURVIVAL OF THE FITTEST",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
};
