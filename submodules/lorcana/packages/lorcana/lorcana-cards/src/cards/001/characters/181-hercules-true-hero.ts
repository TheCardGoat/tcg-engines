import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesTrueHeroI18n } from "./181-hercules-true-hero.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const herculesTrueHero: CharacterCard = {
  id: "Wrj",
  canonicalId: "ci_0p0",
  reprints: ["set1-181", "set9-191"],
  cardType: "character",
  name: "Hercules",
  version: "True Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 181,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2ae8a63bba494c3e842e54ec56da3021",
    tcgPlayer: 650124,
  },
  text: "Bodyguard",
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [bodyguard],
  i18n: herculesTrueHeroI18n,
};
