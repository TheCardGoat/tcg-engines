import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitch as canonicalUrsulaSeaWitch } from "../../003";

export const ursulaSeaWitch: CharacterCard = {
  ...canonicalUrsulaSeaWitch,
  id: "3sS",
  reprints: ["set3-059", "set9-037"],
  set: "009",
  cardNumber: 37,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_48ccbae93afd4032a54bf09f03f6a0c2",
    tcgPlayer: 650145,
  },
};
