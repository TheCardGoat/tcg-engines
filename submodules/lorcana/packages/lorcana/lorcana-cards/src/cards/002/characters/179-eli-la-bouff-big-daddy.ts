import type { CharacterCard } from "@tcg/lorcana-types";
import { eliLaBouffBigDaddyI18n } from "./179-eli-la-bouff-big-daddy.i18n";

export const eliLaBouffBigDaddy: CharacterCard = {
  id: "Mx7",
  canonicalId: "ci_Mx7",
  reprints: ["set2-179"],
  cardType: "character",
  name: "Eli La Bouff",
  version: "Big Daddy",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 179,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8161f9ba546e46c2850f4f97f5b623eb",
    tcgPlayer: 525267,
  },
  classifications: ["Storyborn", "Mentor"],
  i18n: eliLaBouffBigDaddyI18n,
};
