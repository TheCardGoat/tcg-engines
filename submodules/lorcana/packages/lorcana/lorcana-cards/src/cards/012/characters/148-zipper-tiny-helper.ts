import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperTinyHelperI18n } from "./148-zipper-tiny-helper.i18n";

export const zipperTinyHelper: CharacterCard = {
  id: "b66",
  canonicalId: "ci_6uh",
  slug: "lorcana-ci_6uh",
  printings: [
    {
      id: "set12-148",
      artId: "set12-148",
      setCode: "set12",
      collectorNumber: "148",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-148"],
  cardType: "character",
  name: "Zipper",
  version: "Tiny Helper",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 148,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a761922905824d819675a01a357e187f",
    tcgPlayer: "690550",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: zipperTinyHelperI18n,
};
