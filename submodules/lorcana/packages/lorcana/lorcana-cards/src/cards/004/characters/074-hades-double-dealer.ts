import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesDoubleDealerI18n } from "./074-hades-double-dealer.i18n";

export const hadesDoubleDealer: CharacterCard = {
  id: "V9W",
  canonicalId: "ci_V9W",
  reprints: ["set4-074"],
  cardType: "character",
  name: "Hades",
  version: "Double Dealer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 74,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_56206ef4f9ec4b82afc4a656d41e5ba4",
    tcgPlayer: 550575,
  },
  text: [
    {
      title: "HERE'S THE TRADE-OFF",
      description:
        "{E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      cost: {
        exert: true,
        banishCharacter: true,
        banishCharacterTarget: "another",
      },
      effect: {
        cardType: "character",
        cost: "free",
        from: "hand",
        filter: {
          cardType: "character",
          sameNameAsChosenCard: true,
        },
        type: "play-card",
      },
      id: "i41-1",
      name: "HERE'S THE TRADE-OFF",
      text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
      type: "activated",
    },
  ],
  i18n: hadesDoubleDealerI18n,
};
