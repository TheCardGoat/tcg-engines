import type { CharacterCard } from "@tcg/lorcana-types";
import { doloresMadrigalEasyListener as canonicalDoloresMadrigalEasyListener } from "../../004";

export const doloresMadrigalEasyListener: CharacterCard = {
  ...canonicalDoloresMadrigalEasyListener,
  id: "L27",
  reprints: ["set4-041", "set9-051"],
  set: "009",
  cardNumber: 51,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d9a1ea3bfe5d4911918825597c51e0a6",
    tcgPlayer: 649995,
  },
};
