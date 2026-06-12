import type { ActionCard } from "@tcg/lorcana-types";
import { beKingUndisputed } from "../../004";

export const beKingUndisputedEpic: ActionCard = {
  ...beKingUndisputed,
  id: "3t5",
  reprints: ["set4-129", "set9-133"],
  set: "009",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_d47a329c9f87420c8c2714ea6f7fffde",
    tcgPlayer: 650152,
  },
};
