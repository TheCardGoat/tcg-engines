import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaProtectiveCubI18n } from "./020-simba-protective-cub.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const simbaProtectiveCub: CharacterCard = {
  id: "ibT",
  canonicalId: "ci_ibT",
  reprints: ["set1-020"],
  cardType: "character",
  name: "Simba",
  version: "Protective Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 20,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3bd1e1b8b3a4ca094cefbc1d7bf4d60",
    tcgPlayer: 503356,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [bodyguard],
  i18n: simbaProtectiveCubI18n,
};
