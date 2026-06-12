import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesDaringDemigodI18n } from "./109-hercules-daring-demigod.i18n";
import { reckless } from "../../../helpers/abilities/reckless";
import { rush } from "../../../helpers/abilities/rush";

export const herculesDaringDemigod: CharacterCard = {
  id: "044",
  canonicalId: "ci_044",
  reprints: ["set4-109"],
  cardType: "character",
  name: "Hercules",
  version: "Daring Demigod",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 109,
  rarity: "uncommon",
  cost: 5,
  strength: 7,
  willpower: 3,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_90c1d84c1ab7490897021c0eb19f781c",
    tcgPlayer: 550592,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [rush, reckless],
  i18n: herculesDaringDemigodI18n,
};
