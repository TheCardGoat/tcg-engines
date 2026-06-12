import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonArrogantHunter as canonicalGastonArrogantHunter } from "../../001";

export const gastonArrogantHunter: CharacterCard = {
  ...canonicalGastonArrogantHunter,
  id: "Wks",
  reprints: ["set1-110", "set9-115"],
  set: "009",
  cardNumber: 115,
  rarity: "common",
  externalIds: {
    lorcast: "crd_6f87816bd3e042a4852e68f2d23a5807",
    tcgPlayer: 650051,
  },
};
