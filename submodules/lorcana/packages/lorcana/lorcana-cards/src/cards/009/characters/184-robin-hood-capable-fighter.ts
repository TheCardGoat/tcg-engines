import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCapableFighter as canonicalRobinHoodCapableFighter } from "../../002";

export const robinHoodCapableFighter: CharacterCard = {
  ...canonicalRobinHoodCapableFighter,
  id: "CNR",
  reprints: ["set2-193", "set9-184"],
  set: "009",
  cardNumber: 184,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_888f26474eba4f569f94c99251eddf06",
    tcgPlayer: 650155,
  },
};
