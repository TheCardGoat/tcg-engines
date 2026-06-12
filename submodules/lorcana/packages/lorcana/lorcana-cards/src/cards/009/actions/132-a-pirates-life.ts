import type { ActionCard } from "@tcg/lorcana-types";
import { aPiratesLife as canonicalAPiratesLife } from "../../004";

export const aPiratesLife: ActionCard = {
  ...canonicalAPiratesLife,
  id: "rJQ",
  reprints: ["set4-128", "set9-132"],
  set: "009",
  cardNumber: 132,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_480463cc9e3f4f7b9cb1c96a83d69544",
    tcgPlayer: 650067,
  },
};
