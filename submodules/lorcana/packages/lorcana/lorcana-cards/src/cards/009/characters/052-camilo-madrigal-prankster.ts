import type { CharacterCard } from "@tcg/lorcana-types";
import { camiloMadrigalPrankster as canonicalCamiloMadrigalPrankster } from "../../004";

export const camiloMadrigalPrankster: CharacterCard = {
  ...canonicalCamiloMadrigalPrankster,
  id: "h3m",
  reprints: ["set4-040", "set9-052"],
  set: "009",
  cardNumber: 52,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_b07f766507574745ae00ade904bd2558",
    tcgPlayer: 649996,
  },
};
