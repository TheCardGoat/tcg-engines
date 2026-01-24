import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPiratePitcher: CharacterCard = {
  id: "xu8",
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Pitcher",
  fullName: "Kakamora - Pirate Pitcher",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "79f65d15a684177f3f64714d83bd3b2b626893fb",
  },
  abilities: [
    {
      id: "xu8-1",
      type: "triggered",
      name: "DIZZYING SPEED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
      text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
};
