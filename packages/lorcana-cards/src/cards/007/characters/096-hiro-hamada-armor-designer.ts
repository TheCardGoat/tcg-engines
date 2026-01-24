import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaArmorDesigner: CharacterCard = {
  id: "zri",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Armor Designer",
  fullName: "Hiro Hamada - Armor Designer",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 96,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "80e5899ff870979d2047e3094ca8c48b56af6ada",
  },
  abilities: [
    {
      id: "zri-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "zri-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      text: "YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Inventor"],
};
