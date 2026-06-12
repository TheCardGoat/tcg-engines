import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangImperialCaptain as canonicalLiShangImperialCaptain } from "../../004";

export const liShangImperialCaptain: CharacterCard = {
  ...canonicalLiShangImperialCaptain,
  id: "dWX",
  reprints: ["set4-182", "set9-193"],
  set: "009",
  cardNumber: 193,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_3a743f412ff34cd38bd9896f146950f4",
    tcgPlayer: 650126,
  },
};
