import type { CharacterCard } from "@tcg/lorcana-types";

export const scarEerilyPrepared: CharacterCard = {
  abilities: [
    {
      id: "1rg-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1rg-2",
      name: "SURVIVAL OF THE FITTEST",
      text: "SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Whisper"],
  cost: 5,
  externalIds: {
    ravensburger: "e4aaeaa0e0dad921e2728069209736326c66473f",
  },
  franchise: "Lion King",
  fullName: "Scar - Eerily Prepared",
  id: "1rg",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Scar",
  set: "010",
  strength: 6,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
  version: "Eerily Prepared",
  willpower: 5,
};
