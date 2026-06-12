import type { ActionCard } from "@tcg/lorcana-types";
import { zeroToHeroI18n } from "./032-zero-to-hero.i18n";

export const zeroToHero: ActionCard = {
  id: "YND",
  canonicalId: "ci_YND",
  reprints: ["set2-032"],
  cardType: "action",
  name: "Zero to Hero",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 32,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_03538324959a406cb3ac98684214d437",
    tcgPlayer: 516387,
  },
  text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: {
          controller: "you",
          type: "characters-in-play",
        },
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
    },
  ],
  i18n: zeroToHeroI18n,
};
