import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckAfficionadoOfAntiquitiesI18n } from "./140-scrooge-mcduck-afficionado-of-antiquities.i18n";

export const scroogeMcduckAfficionadoOfAntiquities: CharacterCard = {
  id: "fV0",
  canonicalId: "ci_fV0",
  reprints: ["set5-140"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Afficionado of Antiquities",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "005",
  cardNumber: 140,
  rarity: "rare",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d71041d05a2249a6a4785367a7236274",
    tcgPlayer: 561642,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: scroogeMcduckAfficionadoOfAntiquitiesI18n,
};
