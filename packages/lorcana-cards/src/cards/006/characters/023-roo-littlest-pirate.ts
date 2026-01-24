import type { CharacterCard } from "@tcg/lorcana-types";

export const rooLittlestPirate: CharacterCard = {
  id: "q64",
  cardType: "character",
  name: "Roo",
  version: "Littlest Pirate",
  fullName: "Roo - Littlest Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e51d257d6b1fcde2adb3b7b91d7893fe3916c21",
  },
  abilities: [
    {
      id: "q64-1",
      type: "triggered",
      name: "I'M A PIRATE TOO!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Pirate"],
};
