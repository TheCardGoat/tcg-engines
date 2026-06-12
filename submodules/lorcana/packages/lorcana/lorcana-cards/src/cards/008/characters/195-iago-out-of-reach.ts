import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoOutOfReachI18n } from "./195-iago-out-of-reach.i18n";

export const iagoOutOfReach: CharacterCard = {
  id: "d1f",
  canonicalId: "ci_d1f",
  reprints: ["set8-195"],
  cardType: "character",
  name: "Iago",
  version: "Out of Reach",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 195,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_14cf336ace334aa4bb012d3a932242bf",
    tcgPlayer: 631480,
  },
  text: [
    {
      title: "SELF-PRESERVATION",
      description:
        "While you have another exerted character in play, this character can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "resource-count",
        what: "exerted-characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 2,
      },
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "9cu-1",
      name: "SELF-PRESERVATION",
      text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
      type: "static",
    },
  ],
  i18n: iagoOutOfReachI18n,
};
