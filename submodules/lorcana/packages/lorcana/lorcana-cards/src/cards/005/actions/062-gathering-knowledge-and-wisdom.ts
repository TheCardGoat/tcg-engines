import type { ActionCard } from "@tcg/lorcana-types";
import { gatheringKnowledgeAndWisdomI18n } from "./062-gathering-knowledge-and-wisdom.i18n";

export const gatheringKnowledgeAndWisdom: ActionCard = {
  id: "hDY",
  canonicalId: "ci_hDY",
  reprints: ["set5-062"],
  cardType: "action",
  name: "Gathering Knowledge and Wisdom",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 62,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f199d7305e4a4b0a81d20610d4761aa9",
    tcgPlayer: 561620,
  },
  text: "Gain 2 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 2,
        type: "gain-lore",
      },
    },
  ],
  i18n: gatheringKnowledgeAndWisdomI18n,
};
