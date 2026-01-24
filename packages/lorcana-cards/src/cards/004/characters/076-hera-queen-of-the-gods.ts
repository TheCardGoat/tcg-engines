import type { CharacterCard } from "@tcg/lorcana-types";

export const heraQueenOfTheGods: CharacterCard = {
  id: "149",
  cardType: "character",
  name: "Hera",
  version: "Queen of the Gods",
  fullName: "Hera - Queen of the Gods",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nPROTECTIVE GODDESS Your characters named Zeus gain Ward.\nYOU'RE A TRUE HERO Your characters named Hercules gain Evasive. (Only characters with Evasive can challenge them.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 76,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "908c1d368aae7b1e8b09740cb282e4eae501ef42",
  },
  abilities: [
    {
      id: "149-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "149-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      text: "PROTECTIVE GODDESS Your characters named Zeus gain Ward.",
    },
    {
      id: "149-3",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      text: "YOU'RE A TRUE HERO Your characters named Hercules gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Queen", "Deity"],
};
