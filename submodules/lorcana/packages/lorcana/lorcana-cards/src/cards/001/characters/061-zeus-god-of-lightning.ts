import type { CharacterCard } from "@tcg/lorcana-types";
import { zeusGodOfLightningI18n } from "./061-zeus-god-of-lightning.i18n";
import { rush } from "../../../helpers/abilities/rush";
import { challenger } from "../../../helpers/abilities/challenger";

export const zeusGodOfLightning: CharacterCard = {
  id: "oPz",
  canonicalId: "ci_oPz",
  reprints: ["set1-061"],
  cardType: "character",
  name: "Zeus",
  version: "God of Lightning",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 61,
  rarity: "rare",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_48d5eae218d14c72a3b0485e369b2d06",
    tcgPlayer: 502540,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Challenger +4",
    },
  ],
  classifications: ["Storyborn", "Deity"],
  abilities: [rush, challenger(4)],
  i18n: zeusGodOfLightningI18n,
};
