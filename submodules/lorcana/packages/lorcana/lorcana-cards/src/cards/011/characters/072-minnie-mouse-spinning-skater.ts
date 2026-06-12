import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseSpinningSkaterI18n } from "./072-minnie-mouse-spinning-skater.i18n";

export const minnieMouseSpinningSkater: CharacterCard = {
  id: "f22",
  canonicalId: "ci_f22",
  reprints: ["set11-072"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Spinning Skater",
  inkType: ["emerald"],
  set: "011",
  cardNumber: 72,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8db0f3b74ec145c39cb0ec2413c48c75",
    tcgPlayer: 673430,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: minnieMouseSpinningSkaterI18n,
};
