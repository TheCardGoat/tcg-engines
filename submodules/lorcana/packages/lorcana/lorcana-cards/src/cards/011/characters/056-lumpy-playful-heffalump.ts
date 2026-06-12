import type { CharacterCard } from "@tcg/lorcana-types";
import { lumpyPlayfulHeffalumpI18n } from "./056-lumpy-playful-heffalump.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const lumpyPlayfulHeffalump: CharacterCard = {
  id: "RK4",
  canonicalId: "ci_RK4",
  reprints: ["set11-056"],
  cardType: "character",
  name: "Lumpy",
  version: "Playful Heffalump",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 56,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_89bb9007e02e4003911ada97cfbe4009",
    tcgPlayer: 675285,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: lumpyPlayfulHeffalumpI18n,
};
