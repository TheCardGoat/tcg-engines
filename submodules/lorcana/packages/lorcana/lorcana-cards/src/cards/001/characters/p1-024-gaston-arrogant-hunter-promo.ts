import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonArrogantHunterP1PromoI18n } from "./p1-024-gaston-arrogant-hunter-promo.i18n";

import { reckless } from "../../../helpers/abilities/reckless";

export const gastonArrogantHunterP1Promo: CharacterCard = {
  id: "nZP",
  canonicalId: "ci_5JP",
  slug: "lorcana-ci_5JP",
  printings: [
    {
      id: "set1-p1-024-promo",
      artId: "ci_5JP-promo",
      setCode: "set1",
      collectorNumber: "24",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-110", "set9-115"],
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Hunter",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 24,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_6f87816bd3e042a4852e68f2d23a5807",
    tcgPlayer: "650051",
  },
  text: "Reckless",
  classifications: ["Storyborn", "Villain"],
  abilities: [reckless],
  i18n: gastonArrogantHunterP1PromoI18n,
};
