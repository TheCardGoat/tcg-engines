import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperTinyHelperP3ChallengeI18n } from "./p3-050-zipper-tiny-helper-challenge.i18n";

export const zipperTinyHelperP3Challenge: CharacterCard = {
  id: "ED6",
  canonicalId: "ci_6uh",
  slug: "lorcana-ci_6uh",
  printings: [
    {
      id: "set12-p3-050-challenge",
      artId: "ci_6uh-challenge",
      setCode: "set12",
      collectorNumber: "50",
      rarity: "challenge",
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
  cardNumber: 50,
  rarity: "special",
  specialRarity: "challenge",
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
  i18n: zipperTinyHelperP3ChallengeI18n,
};
