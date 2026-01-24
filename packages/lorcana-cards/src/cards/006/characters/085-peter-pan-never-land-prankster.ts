import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanNeverLandPrankster: CharacterCard = {
  id: "13z",
  cardType: "character",
  name: "Peter Pan",
  version: "Never Land Prankster",
  fullName: "Peter Pan - Never Land Prankster",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  text: "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 85,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "901bb3b670de6ab6f6671cfe9ec415bbd300f9c0",
  },
  abilities: [
    {
      id: "13z-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "LOOK INNOCENT",
      text: "LOOK INNOCENT This character enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
