import type { CharacterCard } from "@tcg/lorcana-types";
import { honestJohnNotThatHonestI18n } from "./109-honest-john-not-that-honest.i18n";

export const honestJohnNotThatHonest: CharacterCard = {
  id: "3zO",
  canonicalId: "ci_3zO",
  reprints: ["set2-109"],
  cardType: "character",
  name: "Honest John",
  version: "Not That Honest",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 109,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_834655aa7bc54dd0b1bdf69ce343359d",
    tcgPlayer: 527275,
  },
  text: [
    {
      title: "EASY STREET",
      description: "Whenever you play a Floodborn character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1de-1",
      name: "EASY STREET",
      text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: honestJohnNotThatHonestI18n,
};
