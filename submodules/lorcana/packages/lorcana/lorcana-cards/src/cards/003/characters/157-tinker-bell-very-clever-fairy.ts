import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellVeryCleverFairyI18n } from "./157-tinker-bell-very-clever-fairy.i18n";

export const tinkerBellVeryCleverFairy: CharacterCard = {
  id: "bd1",
  canonicalId: "ci_bd1",
  reprints: ["set3-157"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Very Clever Fairy",
  inkType: ["sapphire"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 157,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_62d821004e3d483a8d3d91a220cada53",
    tcgPlayer: 536268,
  },
  text: [
    {
      title: "I CAN USE THAT",
      description:
        "Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: {
            ref: "trigger-subject",
          },
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1y4-1",
      name: "I CAN USE THAT",
      text: "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "YOUR_ITEMS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellVeryCleverFairyI18n,
};
