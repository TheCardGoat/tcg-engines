import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimPurpleDragonEnchantedI18n } from "./208-madam-mim-purple-dragon-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const madamMimPurpleDragonEnchanted: CharacterCard = {
  id: "auv",
  canonicalId: "ci_xvT",
  slug: "lorcana-ci_xvT",
  printings: [
    {
      id: "set2-208-enchanted",
      artId: "ci_xvT-enchanted",
      setCode: "set2",
      collectorNumber: "208",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-047"],
  cardType: "character",
  name: "Madam Mim",
  version: "Purple Dragon",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_26dd3cd037974467a3c4078d58f4ae25",
    tcgPlayer: "528107",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "I WIN, I WIN!",
      description:
        "When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Dragon"],
  abilities: [
    evasive,
    {
      effect: {
        type: "or",
        optionLabels: ["banish her", "return another 2 chosen characters of yours to your hand"],
        options: [
          {
            target: "SELF",
            type: "banish",
          },
          {
            target: {
              excludeSelf: true,
              selector: "chosen",
              count: 2,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
        ],
      },
      id: "12t-2",
      name: "I WIN, I WIN!",
      text: "I WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: madamMimPurpleDragonEnchantedI18n,
};
