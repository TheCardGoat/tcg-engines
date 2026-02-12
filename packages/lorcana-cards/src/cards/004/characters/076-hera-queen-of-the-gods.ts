import type { CharacterCard } from "@tcg/lorcana-types";

export const heraQueenOfTheGods: CharacterCard = {
  abilities: [
    {
      id: "149-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "149-2",
      text: "PROTECTIVE GODDESS Your characters named Zeus gain Ward.",
      type: "action",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "149-3",
      text: "YOU'RE A TRUE HERO Your characters named Hercules gain Evasive.",
      type: "action",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Storyborn", "Queen", "Deity"],
  cost: 3,
  externalIds: {
    ravensburger: "908c1d368aae7b1e8b09740cb282e4eae501ef42",
  },
  franchise: "Hercules",
  fullName: "Hera - Queen of the Gods",
  id: "149",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Hera",
  set: "004",
  strength: 1,
  text: "Ward (Opponents can't choose this character except to challenge.)\nPROTECTIVE GODDESS Your characters named Zeus gain Ward.\nYOU'RE A TRUE HERO Your characters named Hercules gain Evasive. (Only characters with Evasive can challenge them.)",
  version: "Queen of the Gods",
  willpower: 3,
};
