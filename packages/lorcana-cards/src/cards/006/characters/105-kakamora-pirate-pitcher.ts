import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPiratePitcher: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "xu8-1",
      name: "DIZZYING SPEED",
      text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "79f65d15a684177f3f64714d83bd3b2b626893fb",
  },
  franchise: "Moana",
  fullName: "Kakamora - Pirate Pitcher",
  id: "xu8",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kakamora",
  set: "006",
  strength: 1,
  text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  version: "Pirate Pitcher",
  willpower: 3,
};
