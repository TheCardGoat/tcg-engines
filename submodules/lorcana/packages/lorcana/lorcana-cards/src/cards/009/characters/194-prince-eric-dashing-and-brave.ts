import type { CharacterCard } from "@tcg/lorcana-types";
import { princeEricDashingAndBrave as canonicalPrinceEricDashingAndBrave } from "../../001";

export const princeEricDashingAndBrave: CharacterCard = {
  ...canonicalPrinceEricDashingAndBrave,
  id: "Moj",
  reprints: ["set1-187", "set9-194"],
  set: "009",
  cardNumber: 194,
  rarity: "common",
  externalIds: {
    lorcast: "crd_81a978c964b049f19747a98304b7f03d",
    tcgPlayer: 650127,
  },
};
