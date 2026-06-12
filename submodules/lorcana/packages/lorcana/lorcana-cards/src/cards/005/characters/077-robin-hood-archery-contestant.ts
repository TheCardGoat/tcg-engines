import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodArcheryContestantI18n } from "./077-robin-hood-archery-contestant.i18n";

export const robinHoodArcheryContestant: CharacterCard = {
  id: "pmt",
  canonicalId: "ci_pmt",
  reprints: ["set5-077"],
  cardType: "character",
  name: "Robin Hood",
  version: "Archery Contestant",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 77,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d3eec99c8a746a5b8b774fb50cc5180",
    tcgPlayer: 561956,
  },
  text: [
    {
      title: "TRICK SHOT",
      description:
        "When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "opponent-has-damaged-character",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "t9f-1",
      name: "TRICK SHOT",
      text: "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: robinHoodArcheryContestantI18n,
};
