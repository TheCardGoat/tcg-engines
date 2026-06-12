import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimPurpleDragonI18n } from "./047-madam-mim-purple-dragon.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const madamMimPurpleDragon: CharacterCard = {
  id: "EHY",
  canonicalId: "ci_xvT",
  reprints: ["set2-047"],
  cardType: "character",
  name: "Madam Mim",
  version: "Purple Dragon",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 47,
  rarity: "legendary",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_26dd3cd037974467a3c4078d58f4ae25",
    tcgPlayer: 528107,
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
  i18n: madamMimPurpleDragonI18n,
};
