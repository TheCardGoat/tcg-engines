import type { CharacterCard } from "@tcg/lorcana-types";
import { olafFriendlySnowman as canonicalOlafFriendlySnowman } from "../../001";

export const olafFriendlySnowman: CharacterCard = {
  ...canonicalOlafFriendlySnowman,
  id: "u9s",
  reprints: ["set1-052", "set9-055"],
  set: "009",
  cardNumber: 55,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_e00da6aac653437aba64ee3268fc29b8",
    tcgPlayer: 649999,
  },
};
