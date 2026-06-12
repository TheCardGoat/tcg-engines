import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperTinyHelperP3ChallengeI18n } from "./p3-050-zipper-tiny-helper-challenge.i18n";
import { zipperTinyHelper } from "./148-zipper-tiny-helper";

export const zipperTinyHelperP3Challenge: CharacterCard = {
  ...zipperTinyHelper,
  id: "u1R",
  set: "P03",
  cardNumber: 50,
  rarity: "special",
  specialRarity: "challenge",
  i18n: zipperTinyHelperP3ChallengeI18n,
};
