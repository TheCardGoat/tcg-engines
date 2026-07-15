import type { ActionCard } from "@tcg/lorcana-types";

export const gatheringKnowledgeAndWisdom: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "pjc-1",
      text: "Gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 62,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "5c09a4c51f5fe4668bbd8723ebc416da70603684",
  },
  franchise: "Sword in the Stone",
  id: "pjc",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Gathering Knowledge and Wisdom",
  set: "005",
  text: "Gain 2 lore.",
};
