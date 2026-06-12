import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanMenacingPredatorI18n } from "./126-shere-khan-menacing-predator.i18n";

export const shereKhanMenacingPredator: CharacterCard = {
  id: "e9n",
  canonicalId: "ci_68m",
  reprints: ["set2-126", "set9-104"],
  cardType: "character",
  name: "Shere Khan",
  version: "Menacing Predator",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "002",
  cardNumber: 126,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4245d44a1e8344e1878acd9002b813e0",
    tcgPlayer: 650042,
  },
  text: [
    {
      title: "DON'T INSULT MY INTELLIGENCE",
      description: "Whenever one of your characters challenges another character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1nj-1",
      name: "DON'T INSULT MY INTELLIGENCE",
      text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
      trigger: {
        defender: {},
        event: "challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: shereKhanMenacingPredatorI18n,
};
