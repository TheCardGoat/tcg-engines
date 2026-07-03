import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckBuccaneerP3PromoI18n } from "./p3-015-donald-duck-buccaneer-promo.i18n";

export const donaldDuckBuccaneerP3Promo: CharacterCard = {
  id: "sss",
  canonicalId: "ci_QUn",
  slug: "lorcana-ci_QUn",
  printings: [
    {
      id: "set4-p3-015-promo",
      artId: "ci_QUn-promo",
      setCode: "set4",
      collectorNumber: "15",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set4-179"],
  cardType: "character",
  name: "Donald Duck",
  version: "Buccaneer",
  inkType: ["steel"],
  set: "004",
  cardNumber: 15,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_48f207edc9374126bd3ac01d43cbc2b8",
    tcgPlayer: "650211",
  },
  text: [
    {
      title: "BOARDING PARTY",
      description:
        "During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      id: "va5-1",
      name: "BOARDING PARTY",
      text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckBuccaneerP3PromoI18n,
};
