import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodUnrivaledArcher as canonicalRobinHoodUnrivaledArcher } from "../../001";

export const robinHoodUnrivaledArcher: CharacterCard = {
  ...canonicalRobinHoodUnrivaledArcher,
  id: "eWY",
  reprints: ["set1-157", "set9-162"],
  set: "009",
  cardNumber: 162,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_b00a7190a315433ebbd327dd79450960",
    tcgPlayer: 650096,
  },
};
