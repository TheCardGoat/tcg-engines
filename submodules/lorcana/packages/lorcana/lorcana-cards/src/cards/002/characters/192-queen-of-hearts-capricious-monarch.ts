import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsCapriciousMonarchI18n } from "./192-queen-of-hearts-capricious-monarch.i18n";

export const queenOfHeartsCapriciousMonarch: CharacterCard = {
  id: "1vc",
  canonicalId: "ci_1vc",
  reprints: ["set2-192"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Capricious Monarch",
  inkType: ["steel"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 192,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e2f72bebe6594283a1d71d93ba4e72bc",
    tcgPlayer: 525269,
  },
  text: [
    {
      title: "OFF WITH THEIR HEADS!",
      description: "Whenever an opposing character is banished, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [
    {
      id: "qi9-1",
      name: "OFF WITH THEIR HEADS!",
      text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    },
  ],
  i18n: queenOfHeartsCapriciousMonarchI18n,
};
