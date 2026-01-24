import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaRoboticsProdigy: CharacterCard = {
  id: "r87",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Robotics Prodigy",
  fullName: "Hiro Hamada - Robotics Prodigy",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 145,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6221b7a9a5416d22eb42da8eb9fdc0b92ea2e928",
  },
  abilities: [
    {
      id: "r87-1",
      type: "action",
      effect: {
        type: "search-deck",
        putInto: "hand",
        shuffle: true,
      },
      text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
