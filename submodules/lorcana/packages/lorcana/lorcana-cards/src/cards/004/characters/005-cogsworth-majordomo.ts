import type { CharacterCard } from "@tcg/lorcana-types";
import { cogsworthMajordomoI18n } from "./005-cogsworth-majordomo.i18n";

export const cogsworthMajordomo: CharacterCard = {
  id: "94i",
  canonicalId: "ci_94i",
  reprints: ["set4-005"],
  cardType: "character",
  name: "Cogsworth",
  version: "Majordomo",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 5,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0934af0f0b04689914f8e20d868c1af",
    tcgPlayer: 550554,
  },
  text: [
    {
      title: "AS YOU WERE!",
      description:
        "Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "94i-1",
      name: "AS YOU WERE!",
      text: "AS YOU WERE! Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          modifier: -2,
          stat: "strength",
          duration: "until-start-of-next-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
    },
  ],
  i18n: cogsworthMajordomoI18n,
};
