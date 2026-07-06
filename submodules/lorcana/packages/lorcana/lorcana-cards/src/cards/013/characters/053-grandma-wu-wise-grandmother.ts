import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../../helpers/abilities/challenger";
import { grandmaWuWiseGrandmotherI18n } from "./053-grandma-wu-wise-grandmother.i18n";

export const grandmaWuWiseGrandmother: CharacterCard = {
  id: "R3I",
  canonicalId: "ci_R3I",
  slug: "lorcana-ci_R3I",
  printings: [
    {
      id: "set13-053",
      artId: "set13-053",
      setCode: "set13",
      collectorNumber: "53",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-053"],
  cardType: "character",
  name: "Grandma Wu",
  version: "Wise Grandmother",
  inkType: ["amethyst"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 53,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "Ancestral Understanding",
      description: "When you shift a character on top of this character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Red Panda"],
  abilities: [
    challenger(2),
    {
      type: "triggered",
      name: "ANCESTRAL UNDERSTANDING",
      text: "ANCESTRAL UNDERSTANDING When you shift a character on top of this character, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          shiftedOntoSelf: true,
        },
        timing: "when",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: grandmaWuWiseGrandmotherI18n,
};
