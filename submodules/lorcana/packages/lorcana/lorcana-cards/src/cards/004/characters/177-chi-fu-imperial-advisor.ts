import type { CharacterCard } from "@tcg/lorcana-types";
import { chifuImperialAdvisorI18n } from "./177-chi-fu-imperial-advisor.i18n";

export const chifuImperialAdvisor: CharacterCard = {
  id: "XGm",
  canonicalId: "ci_XGm",
  reprints: ["set4-177"],
  cardType: "character",
  name: "Chi-Fu",
  version: "Imperial Advisor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 177,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6d38ee3cce1e48ae9a8e945734ab950f",
    tcgPlayer: 548193,
  },
  text: [
    {
      title: "OVERLY CAUTIOUS",
      description: "While this character has no damage, he gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "m5z-1",
      name: "OVERLY CAUTIOUS",
      text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: chifuImperialAdvisorI18n,
};
