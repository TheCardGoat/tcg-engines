import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalUndetectedUncle as canonicalBrunoMadrigalUndetectedUncle } from "../../004";

export const brunoMadrigalUndetectedUncle: CharacterCard = {
  ...canonicalBrunoMadrigalUndetectedUncle,
  id: "Plh",
  reprints: ["set4-039", "set9-000"],
  set: "009",
  cardNumber: 0,
  rarity: "common",
  externalIds: {
    lorcast: "crd_2cbda843e29c4e6392ccddd6858eeb7d",
    tcgPlayer: 651127,
  },
};
