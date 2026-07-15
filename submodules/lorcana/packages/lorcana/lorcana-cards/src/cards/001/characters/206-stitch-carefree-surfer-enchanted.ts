import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSurferEnchantedI18n } from "./206-stitch-carefree-surfer-enchanted.i18n";

export const stitchCarefreeSurferEnchanted: CharacterCard = {
  id: "MQ5",
  canonicalId: "ci_44h",
  slug: "lorcana-ci_44h",
  printings: [
    {
      id: "set1-206-enchanted",
      artId: "ci_44h-enchanted",
      setCode: "set1",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-021", "set9-024"],
  cardType: "character",
  name: "Stitch",
  version: "Carefree Surfer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fdaea5bd7f31497a8284771dd57894cf",
    tcgPlayer: "649972",
  },
  text: [
    {
      title: "OHANA",
      description:
        "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
  abilities: [
    {
      id: "bms-1",
      name: "OHANA",
      text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
      },
    },
  ],
  i18n: stitchCarefreeSurferEnchantedI18n,
};
