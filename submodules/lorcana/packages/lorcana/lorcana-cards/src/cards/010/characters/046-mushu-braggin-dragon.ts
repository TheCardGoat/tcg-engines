import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuBragginDragonI18n } from "./046-mushu-braggin-dragon.i18n";

export const mushuBragginDragon: CharacterCard = {
  id: "7CA",
  canonicalId: "ci_7CA",
  reprints: ["set10-046"],
  cardType: "character",
  name: "Mushu",
  version: "Braggin' Dragon",
  inkType: ["amethyst"],
  franchise: "Mulan",
  set: "010",
  cardNumber: 46,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_27a72e72f78d4fb6812740625edf9f79",
    tcgPlayer: 660001,
  },
  classifications: ["Storyborn", "Ally", "Dragon"],
  i18n: mushuBragginDragonI18n,
};
