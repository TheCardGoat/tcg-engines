import type { LocationCard } from "@tcg/lorcana-types";
import { atlanticaConcertHall as canonicalAtlanticaConcertHall } from "../../004";

export const atlanticaConcertHall: LocationCard = {
  ...canonicalAtlanticaConcertHall,
  id: "WHL",
  reprints: ["set4-033", "set9-034"],
  set: "009",
  cardNumber: 34,
  rarity: "common",
  externalIds: {
    lorcast: "crd_74c2fa84872c4c68ac1eb0e2a7a8affc",
    tcgPlayer: 649981,
  },
};
