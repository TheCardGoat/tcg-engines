import type { CharacterCard } from "@tcg/lorcana";

export const auroraBriarRose: CharacterCard = {
  id: "v54",
  cardType: "character",
  name: "Aurora",
  version: "Briar Rose",
  fullName: "Aurora - Briar Rose",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  externalIds: {
    ravensburger: "703d2d0c9e63fb69fed427dac99aa1f1f589898f",
  },
  abilities: [
    {
      id: "v54-1",
      text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
      name: "DISARMING BEAUTY",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "turn",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
