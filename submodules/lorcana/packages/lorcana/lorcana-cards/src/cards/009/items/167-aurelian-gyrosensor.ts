import type { ItemCard } from "@tcg/lorcana-types";
import { aurelianGyrosensor as canonicalAurelianGyrosensor } from "../../003";

export const aurelianGyrosensor: ItemCard = {
  ...canonicalAurelianGyrosensor,
  id: "12h",
  reprints: ["set3-163", "set9-167"],
  set: "009",
  cardNumber: 167,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_6e6d5ca027b34def81032f79864dc6c6",
    tcgPlayer: 650101,
  },
};
