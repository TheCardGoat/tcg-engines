import type { CharacterCard } from "@tcg/lorcana-types";
import { theIrateChefMeatHutCookI18n } from "./190-the-irate-chef-meat-hut-cook.i18n";

export const theIrateChefMeatHutCook: CharacterCard = {
  id: "NXO",
  canonicalId: "ci_NXO",
  slug: "lorcana-ci_NXO",
  printings: [
    {
      id: "set13-190",
      artId: "set13-190",
      setCode: "set13",
      collectorNumber: "190",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-190"],
  cardType: "character",
  name: "The Irate Chef",
  version: "Meat Hut Cook",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn"],
  i18n: theIrateChefMeatHutCookI18n,
};
