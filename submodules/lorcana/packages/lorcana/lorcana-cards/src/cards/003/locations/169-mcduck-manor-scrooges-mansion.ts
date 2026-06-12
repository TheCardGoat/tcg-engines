import type { LocationCard } from "@tcg/lorcana-types";
import { mcduckManorScroogesMansionI18n } from "./169-mcduck-manor-scrooges-mansion.i18n";

export const mcduckManorScroogesMansion: LocationCard = {
  id: "lTr",
  canonicalId: "ci_lTr",
  reprints: ["set3-169"],
  cardType: "location",
  name: "McDuck Manor",
  version: "Scrooge's Mansion",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 169,
  rarity: "common",
  cost: 4,
  willpower: 9,
  moveCost: 1,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c653c06c96ec4b699dde5bcec70e0693",
    tcgPlayer: 539104,
  },
  i18n: mcduckManorScroogesMansionI18n,
};
