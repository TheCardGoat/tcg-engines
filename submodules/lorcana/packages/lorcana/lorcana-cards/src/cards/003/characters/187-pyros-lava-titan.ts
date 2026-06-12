import type { CharacterCard } from "@tcg/lorcana-types";
import { pyrosLavaTitanI18n } from "./187-pyros-lava-titan.i18n";

export const pyrosLavaTitan: CharacterCard = {
  id: "jKP",
  canonicalId: "ci_jKP",
  reprints: ["set3-187"],
  cardType: "character",
  name: "Pyros",
  version: "Lava Titan",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 187,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f68e5422b47243a1b385c562531498f4",
    tcgPlayer: 539113,
  },
  text: [
    {
      title: "ERUPTION",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.",
    },
  ],
  classifications: ["Storyborn", "Titan"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "13y-1",
      name: "ERUPTION",
      text: "ERUPTION During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: pyrosLavaTitanI18n,
};
