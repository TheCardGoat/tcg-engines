import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaDeceiver as canonicalUrsulaDeceiver } from "../../003";

export const ursulaDeceiver: CharacterCard = {
  ...canonicalUrsulaDeceiver,
  id: "AY1",
  reprints: ["set3-090", "set9-090"],
  set: "009",
  cardNumber: 90,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_af9ce05b294a4ecdb8e7401fff74a992",
    tcgPlayer: 650029,
  },
};
