import type { ActionCard } from "@tcg/lorcana-types";
import { suddenChill as canonicalSuddenChill } from "../../001";

export const suddenChill: ActionCard = {
  ...canonicalSuddenChill,
  id: "9VA",
  reprints: ["set1-098", "set9-095"],
  set: "009",
  cardNumber: 95,
  rarity: "common",
  externalIds: {
    lorcast: "crd_541fd75946914a688a54b5fc5f1d966d",
    tcgPlayer: 650033,
  },
};
