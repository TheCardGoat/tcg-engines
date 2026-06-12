import type { CharacterCard } from "@tcg/lorcana-types";
import { genieExcitedShipbuilderI18n } from "./038-genie-excited-shipbuilder.i18n";

export const genieExcitedShipbuilder: CharacterCard = {
  id: "nk3",
  canonicalId: "ci_nk3",
  reprints: ["set6-038"],
  cardType: "character",
  name: "Genie",
  version: "Excited Shipbuilder",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 38,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8a0ce27bd434498ba454be0571e58c5b",
    tcgPlayer: 593006,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: genieExcitedShipbuilderI18n,
};
