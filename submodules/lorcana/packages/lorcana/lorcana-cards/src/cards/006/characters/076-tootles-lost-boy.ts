import type { CharacterCard } from "@tcg/lorcana-types";
import { tootlesLostBoyI18n } from "./076-tootles-lost-boy.i18n";

export const tootlesLostBoy: CharacterCard = {
  id: "YhD",
  canonicalId: "ci_YhD",
  reprints: ["set6-076"],
  cardType: "character",
  name: "Tootles",
  version: "Lost Boy",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 76,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7c33f5d581a4424f97da41b37ef8f723",
    tcgPlayer: 588068,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tootlesLostBoyI18n,
};
