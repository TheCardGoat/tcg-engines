import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoDeterminedDefender as canonicalPlutoDeterminedDefender } from "../../003";

export const plutoDeterminedDefender: CharacterCard = {
  ...canonicalPlutoDeterminedDefender,
  id: "yv4",
  reprints: ["set3-017", "set9-014"],
  set: "009",
  cardNumber: 14,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_d30e5a514aae4bd9b28d98cf45569a23",
    tcgPlayer: 649963,
  },
};
