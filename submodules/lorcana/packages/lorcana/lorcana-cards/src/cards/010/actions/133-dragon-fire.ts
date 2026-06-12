import type { ActionCard } from "@tcg/lorcana-types";
import { dragonFire as canonicalDragonFire } from "../../001";

export const dragonFire: ActionCard = {
  ...canonicalDragonFire,
  id: "C8T",
  reprints: ["set1-130", "set10-133"],
  set: "010",
  cardNumber: 133,
  rarity: "common",
  externalIds: {
    lorcast: "crd_c5d9b54870104360b88dfd59bbb28af5",
    tcgPlayer: 659245,
  },
};
