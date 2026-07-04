import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseDetectiveP1PromoI18n } from "./p1-008-mickey-mouse-detective-promo.i18n";

export const mickeyMouseDetectiveP1Promo: CharacterCard = {
  id: "hSI",
  canonicalId: "ci_Ff8",
  slug: "lorcana-ci_Ff8",
  printings: [
    {
      id: "set1-p1-008-promo",
      artId: "ci_Ff8-promo",
      setCode: "set1",
      collectorNumber: "8",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-154", "set10-160"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  inkType: ["sapphire"],
  set: "001",
  cardNumber: 8,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9b6f273381924929ba2d6f6d3e990f66",
    tcgPlayer: "659388",
  },
  text: [
    {
      title: "GET",
      description:
        "A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1wh-1",
      name: "GET A CLUE",
      text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseDetectiveP1PromoI18n,
};
