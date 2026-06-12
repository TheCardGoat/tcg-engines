import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganNefariousCriminalI18n } from "./143-ratigan-nefarious-criminal.i18n";

export const ratiganNefariousCriminal: CharacterCard = {
  id: "m4P",
  canonicalId: "ci_AfF",
  reprints: ["set7-143"],
  cardType: "character",
  name: "Ratigan",
  version: "Nefarious Criminal",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 143,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c43f19388b414266aeddb6cd78f7c020",
    tcgPlayer: 619744,
  },
  text: [
    {
      title: "A MARVELOUS PERFORMANCE",
      description: "Whenever you play an action while this character is exerted, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "8q4-1",
      name: "A MARVELOUS PERFORMANCE",
      text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
      condition: {
        type: "is-exerted",
      },
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ratiganNefariousCriminalI18n,
};
