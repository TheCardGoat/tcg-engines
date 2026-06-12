import type { CharacterCard } from "@tcg/lorcana-types";
import { thePrinceSearchingForHisLoveI18n } from "./023-the-prince-searching-for-his-love.i18n";

export const thePrinceSearchingForHisLove: CharacterCard = {
  id: "jgX",
  canonicalId: "ci_jgX",
  reprints: ["set12-023"],
  cardType: "character",
  name: "The Prince",
  version: "Searching for His Love",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 23,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_25eee8741de44224946fe827a0debb09",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: thePrinceSearchingForHisLoveI18n,
};
