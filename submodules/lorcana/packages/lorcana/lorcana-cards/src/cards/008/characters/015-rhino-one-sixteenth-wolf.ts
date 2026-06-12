import type { CharacterCard } from "@tcg/lorcana-types";
import { rhinoOnesixteenthWolfI18n } from "./015-rhino-one-sixteenth-wolf.i18n";

export const rhinoOnesixteenthWolf: CharacterCard = {
  id: "dQB",
  canonicalId: "ci_dQB",
  reprints: ["set8-015"],
  cardType: "character",
  name: "Rhino",
  version: "One-Sixteenth Wolf",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 15,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2a18b29a3b7a4034b98a6207ec515377",
    tcgPlayer: 631359,
  },
  text: [
    {
      title: "TINY HOWL",
      description:
        "When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
        duration: "until-start-of-next-turn",
      },
      id: "1bm-1",
      name: "TINY HOWL",
      text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rhinoOnesixteenthWolfI18n,
};
