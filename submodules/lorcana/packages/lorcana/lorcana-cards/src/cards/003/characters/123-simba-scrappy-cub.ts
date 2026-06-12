import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaScrappyCubI18n } from "./123-simba-scrappy-cub.i18n";

export const simbaScrappyCub: CharacterCard = {
  id: "K82",
  canonicalId: "ci_WFz",
  reprints: ["set3-123", "set9-105"],
  cardType: "character",
  name: "Simba",
  version: "Scrappy Cub",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 123,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_49d30b3074984f9288f650908b3d0654",
    tcgPlayer: 650043,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: simbaScrappyCubI18n,
};
