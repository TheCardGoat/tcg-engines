import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangValorousGeneral: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "hga-2",
      text: "LEAD THE CHARGE Your characters with 4 {S} or more get +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 112,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "3ee66a487e0da6e7e8f7e34d90b9a4c6ca3d5865",
  },
  franchise: "Mulan",
  fullName: "Li Shang - Valorous General",
  id: "hga",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Li Shang",
  set: "004",
  strength: 3,
  text: "Shift: Discard a character card (You may discard a character card to play this on top of one of your characters named Li Shang.)\nLEAD THE CHARGE Your characters with 4 {S} or more get +1 {L}.",
  version: "Valorous General",
  willpower: 2,
};
