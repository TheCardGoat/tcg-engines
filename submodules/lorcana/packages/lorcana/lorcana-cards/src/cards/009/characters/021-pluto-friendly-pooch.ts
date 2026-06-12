import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoFriendlyPooch as canonicalPlutoFriendlyPooch } from "../../003";

export const plutoFriendlyPooch: CharacterCard = {
  ...canonicalPlutoFriendlyPooch,
  id: "9tX",
  reprints: ["set3-018", "set9-021"],
  set: "009",
  cardNumber: 21,
  rarity: "common",
  externalIds: {
    lorcast: "crd_c042279e4692458c906cc27ec66448ab",
    tcgPlayer: 649969,
  },
};
