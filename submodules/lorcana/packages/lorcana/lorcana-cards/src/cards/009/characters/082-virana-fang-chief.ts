import type { CharacterCard } from "@tcg/lorcana-types";
import { viranaFangChief as canonicalViranaFangChief } from "../../002";

export const viranaFangChief: CharacterCard = {
  ...canonicalViranaFangChief,
  id: "T9y",
  reprints: ["set2-095", "set9-082"],
  set: "009",
  cardNumber: 82,
  rarity: "common",
  externalIds: {
    lorcast: "crd_6b025bc8b17a487c8e3b40067851f9b9",
    tcgPlayer: 650022,
  },
};
