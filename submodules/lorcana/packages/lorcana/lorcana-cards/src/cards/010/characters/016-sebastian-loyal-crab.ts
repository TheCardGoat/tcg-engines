import type { CharacterCard } from "@tcg/lorcana-types";
import { sebastianLoyalCrabI18n } from "./016-sebastian-loyal-crab.i18n";

export const sebastianLoyalCrab: CharacterCard = {
  id: "g45",
  canonicalId: "ci_g45",
  reprints: ["set10-016"],
  cardType: "character",
  name: "Sebastian",
  version: "Loyal Crab",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 16,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8318e877bb544f51831367a559189e22",
    tcgPlayer: 659605,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: sebastianLoyalCrabI18n,
};
