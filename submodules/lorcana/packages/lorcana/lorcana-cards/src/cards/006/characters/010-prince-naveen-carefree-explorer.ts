import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenCarefreeExplorerI18n } from "./010-prince-naveen-carefree-explorer.i18n";

export const princeNaveenCarefreeExplorer: CharacterCard = {
  id: "dBs",
  canonicalId: "ci_dBs",
  reprints: ["set6-010"],
  cardType: "character",
  name: "Prince Naveen",
  version: "Carefree Explorer",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 10,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_65868398266f4f95944543e1568bf043",
    tcgPlayer: 593038,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: princeNaveenCarefreeExplorerI18n,
};
