import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsResourcefulRabbitI18n } from "./015-judy-hopps-resourceful-rabbit.i18n";
import { support } from "../../../helpers/abilities/support";

export const judyHoppsResourcefulRabbit: CharacterCard = {
  id: "Z78",
  canonicalId: "ci_Z78",
  reprints: ["set6-015"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Resourceful Rabbit",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 15,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_17a352bad7df43d2bfd36a9c2c475c6c",
    tcgPlayer: 579923,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "NEED SOME HELP?",
      description: "At the end of your turn, you may ready another chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    support,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "1r5-2",
      name: "NEED SOME HELP?",
      text: "NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: judyHoppsResourcefulRabbitI18n,
};
