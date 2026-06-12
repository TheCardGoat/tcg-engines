import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellTinyTactician as canonicalTinkerBellTinyTactician } from "../../001";

export const tinkerBellTinyTactician: CharacterCard = {
  ...canonicalTinkerBellTinyTactician,
  id: "LAR",
  reprints: ["set1-194", "set9-189"],
  set: "009",
  cardNumber: 189,
  rarity: "common",
  externalIds: {
    lorcast: "crd_24d837a8adab46e8ac2ffa7859489926",
    tcgPlayer: 650122,
  },
};
