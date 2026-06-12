import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineFearlessPrincessI18n } from "./178-jasmine-fearless-princess.i18n";

export const jasmineFearlessPrincess: CharacterCard = {
  id: "RUI",
  canonicalId: "ci_TLB",
  reprints: ["set9-178"],
  cardType: "character",
  name: "Jasmine",
  version: "Fearless Princess",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 178,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e0b8f2e97fc4d6ca8badbb552024f58",
    tcgPlayer: 651114,
  },
  text: [
    {
      title: "TAKE THE LEAP",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
    {
      title: "NOW'S MY CHANCE",
      description:
        "Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "t89-1",
      name: "TAKE THE LEAP",
      text: "TAKE THE LEAP During your turn, this character gains Evasive.",
      type: "static",
    },
    {
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 3,
      },
      id: "t89-2",
      name: "NOW'S MY CHANCE",
      text: "NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn.",
      type: "activated",
    },
  ],
  i18n: jasmineFearlessPrincessI18n,
};
