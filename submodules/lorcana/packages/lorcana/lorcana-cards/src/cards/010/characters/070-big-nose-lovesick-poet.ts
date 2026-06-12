import type { CharacterCard } from "@tcg/lorcana-types";
import { bigNoseLovesickPoetI18n } from "./070-big-nose-lovesick-poet.i18n";

export const bigNoseLovesickPoet: CharacterCard = {
  id: "Z2b",
  canonicalId: "ci_Z2b",
  reprints: ["set10-070"],
  cardType: "character",
  name: "Big Nose",
  version: "Lovesick Poet",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 70,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_204b70ea506f41b6b6c01bc04ea2b4b0",
    tcgPlayer: 659183,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: bigNoseLovesickPoetI18n,
};
