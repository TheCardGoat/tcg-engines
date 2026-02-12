import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanNeverLandPrankster: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "13z-1",
      name: "LOOK INNOCENT",
      text: "LOOK INNOCENT This character enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 7,
  externalIds: {
    ravensburger: "901bb3b670de6ab6f6671cfe9ec415bbd300f9c0",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Never Land Prankster",
  id: "13z",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Peter Pan",
  set: "006",
  strength: 4,
  text: "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
  version: "Never Land Prankster",
  willpower: 6,
};
