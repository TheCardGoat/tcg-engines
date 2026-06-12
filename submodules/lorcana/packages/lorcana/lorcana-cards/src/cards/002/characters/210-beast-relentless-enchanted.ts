import type { CharacterCard } from "@tcg/lorcana-types";
import { beastRelentless } from "./070-beast-relentless";

export const beastRelentlessEnchanted: CharacterCard = {
  ...beastRelentless,
  id: "WGo",
  reprints: ["set2-070"],
  set: "002",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_458325805fc445799aabfe4c4046f89b",
    tcgPlayer: 527800,
  },
};
