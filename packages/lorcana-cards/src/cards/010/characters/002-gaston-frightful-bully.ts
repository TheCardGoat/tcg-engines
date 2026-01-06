import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonFrightfulBully: CharacterCard = {
  id: "14y",
  cardType: "character",
  name: "Gaston",
  version: "Frightful Bully",
  fullName: "Gaston - Frightful Bully",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 2,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "93a1e91ad769dd24d137c4b39540e3d3e8e6c5bc",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Whisper"],
};
