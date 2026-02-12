import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnPhonyKing: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "m61-1",
      name: "COLLECT TAXES",
      text: "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "4fe5203a587a4cc07595526f729193ba91b0f403",
  },
  franchise: "Robin Hood",
  fullName: "Prince John - Phony King",
  id: "m61",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince John",
  set: "003",
  strength: 2,
  text: "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.",
  version: "Phony King",
  willpower: 4,
};
