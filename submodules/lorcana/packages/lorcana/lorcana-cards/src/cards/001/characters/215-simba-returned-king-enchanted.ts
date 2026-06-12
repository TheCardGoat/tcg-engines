import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaReturnedKing } from "./189-simba-returned-king";

export const simbaReturnedKingEnchanted: CharacterCard = {
  ...simbaReturnedKing,
  id: "vpZ",
  reprints: ["set1-189"],
  set: "001",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_80cf71e223cf491796609458b2866665",
    tcgPlayer: 510162,
  },
};
