import type { CharacterCard } from "@tcg/lorcana-types";
import { gantuHamstervielsAccompliceI18n } from "./176-gantu-hamsterviels-accomplice.i18n";

export const gantuHamstervielsAccomplice: CharacterCard = {
  id: "qvC",
  canonicalId: "ci_qvC",
  reprints: ["set11-176"],
  cardType: "character",
  name: "Gantu",
  version: "Hamsterviel's Accomplice",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 176,
  rarity: "uncommon",
  cost: 1,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e58426a12e4840d1a58c49c2a147f6b4",
    tcgPlayer: 673305,
  },
  text: [
    {
      title: "EASY TARGET",
      description: "When you play this character, choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
  abilities: [
    {
      id: "3ds-1",
      effect: {
        amount: 1,
        chosen: true,
        target: "CONTROLLER",
        type: "discard",
      },
      name: "EASY TARGET",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "EASY TARGET When you play this character, choose and discard a card.",
    },
  ],
  i18n: gantuHamstervielsAccompliceI18n,
};
