import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellMostHelpful as canonicalTinkerBellMostHelpful } from "../../001";

export const tinkerBellMostHelpful: CharacterCard = {
  ...canonicalTinkerBellMostHelpful,
  id: "hsu",
  reprints: ["set1-093", "set9-088"],
  set: "009",
  cardNumber: 88,
  rarity: "common",
  externalIds: {
    lorcast: "crd_2cb6f3824afc43249a7d4dfcdcacbd53",
    tcgPlayer: 650028,
  },
};
