import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaRoboticsProdigy: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "search-deck",
        putInto: "hand",
        shuffle: true,
      },
      id: "r87-1",
      text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
      type: "action",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "6221b7a9a5416d22eb42da8eb9fdc0b92ea2e928",
  },
  franchise: "Big Hero 6",
  fullName: "Hiro Hamada - Robotics Prodigy",
  id: "r87",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hiro Hamada",
  set: "006",
  strength: 0,
  text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
  version: "Robotics Prodigy",
  willpower: 3,
};
