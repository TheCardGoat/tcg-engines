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
  missingTests: true,
  externalIds: {
    ravensburger: "4fe5203a587a4cc07595526f729193ba91b0f403",
  },
  abilities: [
    {
      id: "m61-1",
      type: "triggered",
      name: "COLLECT TAXES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 2,
        target: "EACH_OPPONENT",
      },
      text: "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
