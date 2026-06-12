import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarKeeperOfSecrets as canonicalJafarKeeperOfSecrets } from "../../001";

export const jafarKeeperOfSecrets: CharacterCard = {
  ...canonicalJafarKeeperOfSecrets,
  id: "j6N",
  reprints: ["set1-044", "set9-038"],
  set: "009",
  cardNumber: 38,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_2f69538767394390bc91d25fd5948a5b",
    tcgPlayer: 649985,
  },
};
