import type { ActionCard } from "@tcg/lorcana-types";

export const gatheringKnowledgeAndWisdom: ActionCard = {
  id: "pjc",
  cardType: "action",
  name: "Gathering Knowledge and Wisdom",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Gain 2 lore.",
  cost: 2,
  cardNumber: 62,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5c09a4c51f5fe4668bbd8723ebc416da70603684",
  },
  abilities: [
    {
      id: "pjc-1",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "Gain 2 lore.",
    },
  ],
};
