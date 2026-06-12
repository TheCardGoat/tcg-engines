import type { ActionCard } from "@tcg/lorcana-types";
import { freezeTheVine } from "./096-freeze-the-vine";

export const freezeTheVineEnchanted: ActionCard = {
  ...freezeTheVine,
  id: "2nf",
  reprints: ["set11-096"],
  set: "011",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_d0659baf8fad4748ae9abf7260279d8c",
    tcgPlayer: 675395,
  },
};
