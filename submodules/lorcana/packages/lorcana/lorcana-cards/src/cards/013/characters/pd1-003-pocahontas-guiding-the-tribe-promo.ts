import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasGuidingTheTribePD1PromoI18n } from "./pd1-003-pocahontas-guiding-the-tribe-promo.i18n";

export const pocahontasGuidingTheTribePD1Promo: CharacterCard = {
  id: "4vv",
  canonicalId: "ci_4vv",
  slug: "lorcana-ci_4vv",
  printings: [
    {
      id: "set13-pd1-003-promo",
      artId: "ci_4vv-promo",
      setCode: "set13",
      collectorNumber: "3",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-012"],
  cardType: "character",
  name: "Pocahontas",
  version: "Guiding the Tribe",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 3,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Stay Close",
      description: "When you play this character, you may play a character with cost 1 for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      type: "triggered",
      name: "Stay Close",
      text: "Stay Close When you play this character, you may play a character with cost 1 for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "character",
          cost: "free",
          filter: {
            cardType: "character",
            maxCost: 1,
          },
        },
      },
    },
  ],
  i18n: pocahontasGuidingTheTribePD1PromoI18n,
};
