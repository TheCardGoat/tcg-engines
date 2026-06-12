import type { CharacterCard } from "@tcg/lorcana-types";
import { deweyShowyNephew as canonicalDeweyShowyNephew } from "../../003";

export const deweyShowyNephew: CharacterCard = {
  ...canonicalDeweyShowyNephew,
  id: "7di",
  reprints: ["set3-139", "set9-139"],
  set: "009",
  cardNumber: 139,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_0367a7c71bef46c39719f0c5c0b0dc3b",
    tcgPlayer: 650074,
  },
};
