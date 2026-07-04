import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaAlchemistP1PromoI18n } from "./p1-010-yzma-alchemist-promo.i18n";

export const yzmaAlchemistP1Promo: CharacterCard = {
  id: "Rm1",
  canonicalId: "ci_BVo",
  slug: "lorcana-ci_BVo",
  printings: [
    {
      id: "set1-p1-010-promo",
      artId: "ci_BVo-promo",
      setCode: "set1",
      collectorNumber: "10",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-060"],
  cardType: "character",
  name: "Yzma",
  version: "Alchemist",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 10,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fd1e38170964420294911187ef450c55",
    tcgPlayer: "492715",
  },
  text: [
    {
      title: "YOU'RE EXCUSED",
      description:
        "Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "WU8-1",
      name: "YOU'RE EXCUSED",
      text: "YOU'RE EXCUSED Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: yzmaAlchemistP1PromoI18n,
};
