import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaRoboticsProdigyI18n } from "./145-hiro-hamada-robotics-prodigy.i18n";

export const hiroHamadaRoboticsProdigy: CharacterCard = {
  id: "YrC",
  canonicalId: "ci_YrC",
  reprints: ["set6-145"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Robotics Prodigy",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 145,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4aa4ce170d6840e393a1ffd6c44d96ee",
    tcgPlayer: 578190,
  },
  text: [
    {
      title: "SWEET TECH",
      description:
        "{2} {E} — Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        putInto: "hand",
        shuffle: true,
        type: "search-deck",
      },
      id: "r87-1",
      name: "SWEET TECH",
      text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
      type: "activated",
    },
  ],
  i18n: hiroHamadaRoboticsProdigyI18n,
};
