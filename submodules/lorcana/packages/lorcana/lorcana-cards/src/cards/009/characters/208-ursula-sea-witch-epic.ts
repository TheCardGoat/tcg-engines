import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitch } from "../../003";

export const ursulaSeaWitchEpic: CharacterCard = {
  ...ursulaSeaWitch,
  id: "FEw",
  reprints: ["set3-059", "set9-037"],
  set: "009",
  cardNumber: 208,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_48ccbae93afd4032a54bf09f03f6a0c2",
    tcgPlayer: 650145,
  },
};
