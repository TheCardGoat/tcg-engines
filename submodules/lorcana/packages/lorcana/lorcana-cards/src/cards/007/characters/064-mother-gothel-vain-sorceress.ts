import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelVainSorceressI18n } from "./064-mother-gothel-vain-sorceress.i18n";

export const motherGothelVainSorceress: CharacterCard = {
  id: "6jS",
  canonicalId: "ci_6jS",
  reprints: ["set7-064"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Vain Sorceress",
  inkType: ["amethyst", "ruby"],
  franchise: "Tangled",
  set: "007",
  cardNumber: 64,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3c674103cf444a0b948e0b8be6a0e0e4",
    tcgPlayer: 619442,
  },
  text: [
    {
      title: "NOW YOU'VE UPSET ME",
      description:
        "Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "6jS-1",
      name: "NOW YOU'VE UPSET ME",
      text: "NOW YOU'VE UPSET ME Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: 1,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: motherGothelVainSorceressI18n,
};
