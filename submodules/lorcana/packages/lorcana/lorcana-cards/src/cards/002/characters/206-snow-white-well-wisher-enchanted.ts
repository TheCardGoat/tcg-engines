import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteWellWisher } from "./025-snow-white-well-wisher";

export const snowWhiteWellWisherEnchanted: CharacterCard = {
  ...snowWhiteWellWisher,
  id: "wc4",
  reprints: ["set2-025"],
  set: "002",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_e97e4b9894fe4c9798b0d925092d3eea",
    tcgPlayer: 527799,
  },
};
