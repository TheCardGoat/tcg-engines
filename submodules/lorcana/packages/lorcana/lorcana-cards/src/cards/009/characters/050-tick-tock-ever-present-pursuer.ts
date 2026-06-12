import type { CharacterCard } from "@tcg/lorcana-types";
import { ticktockEverpresentPursuer as canonicalTicktockEverpresentPursuer } from "../../004";

export const ticktockEverpresentPursuer: CharacterCard = {
  ...canonicalTicktockEverpresentPursuer,
  id: "OT7",
  reprints: ["set4-056", "set9-050"],
  set: "009",
  cardNumber: 50,
  rarity: "common",
  externalIds: {
    lorcast: "crd_cefa62e7a0f246dd81c4c7628c3c054c",
    tcgPlayer: 649994,
  },
};
