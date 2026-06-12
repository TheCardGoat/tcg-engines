import type { CharacterCard } from "@tcg/lorcana-types";
import { stabbingtonBrotherWithoutAPatchI18n } from "./125-stabbington-brother-without-a-patch.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const stabbingtonBrotherWithoutAPatch: CharacterCard = {
  id: "ij4",
  canonicalId: "ci_ij4",
  reprints: ["set7-125"],
  cardType: "character",
  name: "Stabbington Brother",
  version: "Without a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  cardNumber: 125,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bb6b464db7a64c6081cdb443267749e4",
    tcgPlayer: 619474,
  },
  text: "Rush GET 'EM! Your other characters named Stabbington Brother gain Rush.",
  classifications: ["Storyborn", "Ally"],
  abilities: [
    rush,
    {
      effect: {
        keyword: "Rush",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          excludeSelf: true,
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Stabbington Brother",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "ij4-2",
      name: "GET 'EM!",
      text: "GET 'EM! Your other characters named Stabbington Brother gain Rush.",
      type: "static",
    },
  ],
  i18n: stabbingtonBrotherWithoutAPatchI18n,
};
