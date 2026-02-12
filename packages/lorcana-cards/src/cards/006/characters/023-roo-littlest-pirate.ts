import type { CharacterCard } from "@tcg/lorcana-types";

export const rooLittlestPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "q64-1",
      name: "I'M A PIRATE TOO!",
      text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "5e51d257d6b1fcde2adb3b7b91d7893fe3916c21",
  },
  franchise: "Winnie the Pooh",
  fullName: "Roo - Littlest Pirate",
  id: "q64",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Roo",
  set: "006",
  strength: 1,
  text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
  version: "Littlest Pirate",
  willpower: 2,
};
