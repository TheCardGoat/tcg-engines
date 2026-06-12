import type { CharacterCard } from "@tcg/lorcana-types";
import { chacaImpressiveDaughterI18n } from "./138-chaca-impressive-daughter.i18n";

export const chacaImpressiveDaughter: CharacterCard = {
  id: "y9B",
  canonicalId: "ci_y9B",
  reprints: ["set5-138"],
  cardType: "character",
  name: "Chaca",
  version: "Impressive Daughter",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 138,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ee79f31b26a94960a66ea9e5defa5a0c",
    tcgPlayer: 560507,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: chacaImpressiveDaughterI18n,
};
