import type { CharacterCard } from "@tcg/lorcana-types";
import { copperBigDogI18n } from "./116-copper-big-dog.i18n";

export const copperBigDog: CharacterCard = {
  id: "WOu",
  canonicalId: "ci_WOu",
  reprints: ["set12-116"],
  cardType: "character",
  name: "Copper",
  version: "Big Dog",
  inkType: ["ruby"],
  franchise: "Fox and the Hound",
  set: "012",
  cardNumber: 116,
  rarity: "uncommon",
  cost: 6,
  strength: 7,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8cf7165e05a24faea856e32135166b05",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: copperBigDogI18n,
};
