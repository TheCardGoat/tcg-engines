import type { CharacterCard } from "@tcg/lorcana-types";
import { genieMagicalResearcher } from "./049-genie-magical-researcher";

export const genieMagicalResearcherEpic: CharacterCard = {
  ...genieMagicalResearcher,
  id: "RUK",
  reprints: ["set11-049"],
  set: "011",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_13f9925099454b7a8fd6225381d11061",
    tcgPlayer: 675280,
  },
};
