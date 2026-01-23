import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnPhonyKing: CharacterCard = {
  id: "m61",
  cardType: "character",
  name: "Prince John",
  version: "Phony King",
  fullName: "Prince John - Phony King",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 83,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fe5203a587a4cc07595526f729193ba91b0f403",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Prince"],
};
