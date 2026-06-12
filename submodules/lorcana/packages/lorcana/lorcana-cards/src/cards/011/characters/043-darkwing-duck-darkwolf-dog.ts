import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckDarkwolfDogI18n } from "./043-darkwing-duck-darkwolf-dog.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const darkwingDuckDarkwolfDog: CharacterCard = {
  id: "l2V",
  canonicalId: "ci_l2V",
  reprints: ["set11-043"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Darkwolf Dog",
  inkType: ["amethyst"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 43,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_72e6b0eee1f1425ea52d9be4a2984843",
    tcgPlayer: 674851,
  },
  text: "Rush",
  classifications: ["Storyborn", "Super", "Hero", "Detective"],
  abilities: [rush],
  i18n: darkwingDuckDarkwolfDogI18n,
};
