import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCapableFighter } from "../../002";

export const robinHoodCapableFighterEpic: CharacterCard = {
  ...robinHoodCapableFighter,
  id: "XQ4",
  reprints: ["set2-193", "set9-184"],
  set: "009",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_888f26474eba4f569f94c99251eddf06",
    tcgPlayer: 650155,
  },
};
