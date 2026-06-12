import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsHaughtyMonarchI18n } from "./105-queen-of-hearts-haughty-monarch.i18n";

export const queenOfHeartsHaughtyMonarch: CharacterCard = {
  id: "OAZ",
  canonicalId: "ci_OAZ",
  reprints: ["set8-105"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Haughty Monarch",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 105,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f941ecb827224dc5ae1054314c084d0f",
    tcgPlayer: 631688,
  },
  text: [
    {
      title: "COUNT OFF!",
      description:
        "While there are 5 or more characters with damage in play, this character gets +3 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [
    {
      condition: {
        type: "resource-count",
        what: "damaged-characters",
        controller: "any",
        comparison: "greater-or-equal",
        value: 5,
      },
      effect: {
        modifier: 3,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1dq-1",
      name: "COUNT OFF!",
      text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
      type: "static",
    },
  ],
  i18n: queenOfHeartsHaughtyMonarchI18n,
};
