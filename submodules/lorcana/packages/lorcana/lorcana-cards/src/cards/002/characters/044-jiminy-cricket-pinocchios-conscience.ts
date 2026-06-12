import type { CharacterCard } from "@tcg/lorcana-types";
import { jiminyCricketPinocchiosConscienceI18n } from "./044-jiminy-cricket-pinocchios-conscience.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const jiminyCricketPinocchiosConscience: CharacterCard = {
  id: "C3x",
  canonicalId: "ci_C3x",
  reprints: ["set2-044"],
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Pinocchio's Conscience",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 44,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cf6f37c499d34d8aaf47e0e3e2eb6523",
    tcgPlayer: 527302,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "THAT STILL, SMALL VOICE",
      description:
        "When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    evasive,
    {
      id: "tfc-2",
      name: "THAT STILL, SMALL VOICE",
      text: "THAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        controller: "you",
        name: "Pinocchio",
        type: "has-named-character",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
    },
  ],
  i18n: jiminyCricketPinocchiosConscienceI18n,
};
