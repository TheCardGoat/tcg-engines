import type { ActionCard } from "@tcg/lorcana-types";
import { poorUnfortunateSouls as canonicalPoorUnfortunateSouls } from "../../004";

export const poorUnfortunateSouls: ActionCard = {
  ...canonicalPoorUnfortunateSouls,
  id: "SPL",
  reprints: ["set4-060", "set9-061"],
  set: "009",
  cardNumber: 61,
  rarity: "common",
  externalIds: {
    lorcast: "crd_06c998317b6d45d0abc056cea429ad13",
    tcgPlayer: 650005,
  },
};
