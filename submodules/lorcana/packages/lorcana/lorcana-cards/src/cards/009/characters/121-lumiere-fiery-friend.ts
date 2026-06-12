import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereFieryFriend as canonicalLumiereFieryFriend } from "../../004";

export const lumiereFieryFriend: CharacterCard = {
  ...canonicalLumiereFieryFriend,
  id: "qzx",
  reprints: ["set4-113", "set9-121"],
  set: "009",
  cardNumber: 121,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_724fef83bb594bbf883b6fc1bcc6d4e2",
    tcgPlayer: 650056,
  },
};
