import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaArmorDesigner: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "zri-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      id: "zri-2",
      text: "YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Inventor"],
  cost: 7,
  externalIds: {
    ravensburger: "80e5899ff870979d2047e3094ca8c48b56af6ada",
  },
  franchise: "Big Hero 6",
  fullName: "Hiro Hamada - Armor Designer",
  id: "zri",
  inkType: ["emerald", "sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Hiro Hamada",
  set: "007",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)",
  version: "Armor Designer",
  willpower: 6,
};
