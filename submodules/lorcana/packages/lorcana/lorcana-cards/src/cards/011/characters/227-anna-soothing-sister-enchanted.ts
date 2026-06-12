import type { CharacterCard } from "@tcg/lorcana-types";
import { annaSoothingSister } from "./050-anna-soothing-sister";

export const annaSoothingSisterEnchanted: CharacterCard = {
  ...annaSoothingSister,
  id: "ndt",
  reprints: ["set11-050"],
  set: "011",
  cardNumber: 227,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_862f8b58a6e247cd865509856286449e",
    tcgPlayer: 677160,
  },
};
