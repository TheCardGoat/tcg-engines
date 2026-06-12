import type { ItemCard } from "@tcg/lorcana-types";
import { ursulasCauldronI18n } from "./067-ursulas-cauldron.i18n";

export const ursulasCauldron: ItemCard = {
  id: "5L3",
  canonicalId: "ci_5L3",
  reprints: ["set1-067"],
  cardType: "item",
  name: "Ursula’s Cauldron",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 67,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9548bea5e69544d5b3e488e97d33065c",
    tcgPlayer: 507851,
  },
  text: [
    {
      title: "PEER INTO THE DEPTHS",
      description:
        "— Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        destinations: [
          {
            zone: "deck-top",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "1ad-1",
      name: "PEER INTO THE DEPTHS",
      text: "PEER INTO THE DEPTHS {E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      type: "activated",
    },
  ],
  i18n: ursulasCauldronI18n,
};
