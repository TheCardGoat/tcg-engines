import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffMiningTheRuins: CharacterCard = {
  id: "abh",
  cardType: "character",
  name: "Kristoff",
  version: "Mining the Ruins",
  fullName: "Kristoff - Mining the Ruins",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nWORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 159,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25306da70d3153e36ca5d991f62a889aab375668",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Whisper"],
};
