import type { CharacterCard } from "@tcg/op-types";
import { prb02KouzukiMomonosukeReprint107I18n } from "./107-kouzuki-momonosuke-reprint.i18n.ts";

export const prb02KouzukiMomonosukeReprint107: CharacterCard = {
  id: "OP06-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] Add up to 1 of your "Land of Wano" type Characters other than [Kouzuki Momonosuke] to the top or bottom of the owner\'s Life cards face-up.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02KouzukiMomonosukeReprint107I18n,
};
