import type { ItemCard } from "@tcg/lorcana-types";
import { theSorcerersHat } from "./065-the-sorcerers-hat";

export const theSorcerersHatEnchanted: ItemCard = {
  ...theSorcerersHat,
  id: "mE1",
  reprints: ["set3-065"],
  set: "003",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_5a2ba6e63b07496d96a17d2565b2a1db",
    tcgPlayer: 539162,
  },
};
