import type { CharacterCard } from "@tcg/lorcana-types";
import { puaProtectivePigI18n } from "./019-pua-protective-pig.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const puaProtectivePig: CharacterCard = {
  id: "Ai2",
  canonicalId: "ci_Ai2",
  reprints: ["set8-019"],
  cardType: "character",
  name: "Pua",
  version: "Protective Pig",
  inkType: ["amber", "amethyst"],
  franchise: "Moana",
  set: "008",
  cardNumber: 19,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dec273aa1bbc492dafa914363265979c",
    tcgPlayer: 631363,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "FREE FRUIT",
      description: "When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    bodyguard,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1x6-2",
      name: "FREE FRUIT",
      text: "FREE FRUIT When this character is banished, you may draw a card.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: puaProtectivePigI18n,
};
