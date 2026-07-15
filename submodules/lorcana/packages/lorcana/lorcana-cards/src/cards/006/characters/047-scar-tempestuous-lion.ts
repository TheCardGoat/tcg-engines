import type { CharacterCard } from "@tcg/lorcana-types";
import { scarTempestuousLionI18n } from "./047-scar-tempestuous-lion.i18n";

import { rush } from "../../../helpers/abilities/rush";
import { challenger } from "../../../helpers/abilities/challenger";

export const scarTempestuousLion: CharacterCard = {
  id: "7Y4",
  canonicalId: "ci_7Y4",
  slug: "lorcana-ci_7Y4",
  printings: [
    {
      id: "set6-047",
      artId: "set6-047",
      setCode: "set6",
      collectorNumber: "47",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set6-047"],
  cardType: "character",
  name: "Scar",
  version: "Tempestuous Lion",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 47,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6cd588941df64ee2a38738b7f7e23c6a",
    tcgPlayer: "588320",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Challenger +3",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [rush, challenger(3)],
  i18n: scarTempestuousLionI18n,
};
