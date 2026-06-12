import type { CharacterCard } from "@tcg/lorcana-types";
import { calhounCourageousRescuerI18n } from "./026-calhoun-courageous-rescuer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const calhounCourageousRescuer: CharacterCard = {
  id: "Vkp",
  canonicalId: "ci_Vkp",
  reprints: ["set7-026"],
  cardType: "character",
  name: "Calhoun",
  version: "Courageous Rescuer",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 26,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d8c259d718d4d54ac5e45275bffbcf0",
    tcgPlayer: 618130,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "BACK TO START POSITIONS!",
      description:
        "Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Racer"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1m4-2",
      name: "BACK TO START POSITIONS!",
      text: "BACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: calhounCourageousRescuerI18n,
};
