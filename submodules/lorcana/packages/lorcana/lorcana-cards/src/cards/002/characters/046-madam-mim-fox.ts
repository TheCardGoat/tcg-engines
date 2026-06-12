import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimFoxI18n } from "./046-madam-mim-fox.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const madamMimFox: CharacterCard = {
  id: "XBE",
  canonicalId: "ci_XBE",
  reprints: ["set2-046"],
  cardType: "character",
  name: "Madam Mim",
  version: "Fox",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 46,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3c23dd0191ce4f80897a8f50d75bc7bc",
    tcgPlayer: 521719,
  },
  text: [
    {
      title: "CHASING THE RABBIT",
      description:
        "When you play this character, banish her or return another chosen character of yours to your hand.",
    },
    {
      title: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "1ej-1",
      name: "CHASING THE RABBIT",
      text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.",
      effect: {
        type: "or",
        optionLabels: ["banish her", "return another chosen character of yours to your hand"],
        options: [
          {
            target: "SELF",
            type: "banish",
          },
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              excludeSelf: true,
              owner: "you",
              selector: "chosen",
              zones: ["play"],
            },
            type: "return-to-hand",
          },
        ],
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    rush,
  ],
  i18n: madamMimFoxI18n,
};
