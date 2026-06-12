import type { CharacterCard } from "@tcg/lorcana-types";
import { denahiAvengingBrotherI18n } from "./115-denahi-avenging-brother.i18n";

export const denahiAvengingBrother: CharacterCard = {
  id: "UbD",
  canonicalId: "ci_UbD",
  reprints: ["set5-115"],
  cardType: "character",
  name: "Denahi",
  version: "Avenging Brother",
  inkType: ["ruby"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 115,
  rarity: "rare",
  cost: 5,
  strength: 7,
  willpower: 5,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9c1f10eec0c84bd8bae7c5403a6221a7",
    tcgPlayer: 560491,
  },
  classifications: ["Storyborn"],
  i18n: denahiAvengingBrotherI18n,
};
