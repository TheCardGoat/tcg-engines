import type { CharacterCard } from "@tcg/lorcana-types";
import { gantuCaptainCrankyheadI18n } from "./189-gantu-captain-crankyhead.i18n";

export const gantuCaptainCrankyhead: CharacterCard = {
  id: "J9q",
  canonicalId: "ci_J9q",
  reprints: ["set6-189"],
  cardType: "character",
  name: "Gantu",
  version: "Captain Crankyhead",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 189,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4ab60bc408c44708b7f820348cad85c5",
    tcgPlayer: 593004,
  },
  classifications: ["Dreamborn", "Alien", "Captain"],
  i18n: gantuCaptainCrankyheadI18n,
};
