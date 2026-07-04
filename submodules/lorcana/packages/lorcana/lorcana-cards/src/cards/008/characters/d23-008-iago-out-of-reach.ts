import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoOutOfReachD23I18n } from "./d23-008-iago-out-of-reach.i18n";

export const iagoOutOfReachD23: CharacterCard = {
  id: "l7d",
  canonicalId: "ci_d1f",
  slug: "lorcana-ci_d1f",
  printings: [
    {
      id: "set8-d23-008",
      artId: "set8-d23-008",
      setCode: "set8",
      collectorNumber: "8",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set8-d23-008", "set8-195"],
  cardType: "character",
  name: "Iago",
  version: "Out of Reach",
  inkType: ["steel"],
  franchise: "D23",
  set: "008",
  cardNumber: 8,
  rarity: "special",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_14cf336ace334aa4bb012d3a932242bf",
    tcgPlayer: "631480",
  },
  text: [
    {
      title: "Self-Preservation",
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
  i18n: iagoOutOfReachD23I18n,
};
