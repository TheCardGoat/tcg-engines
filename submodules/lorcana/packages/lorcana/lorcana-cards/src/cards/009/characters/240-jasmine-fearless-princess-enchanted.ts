import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineFearlessPrincessEnchantedI18n } from "./240-jasmine-fearless-princess-enchanted.i18n";

export const jasmineFearlessPrincessEnchanted: CharacterCard = {
  id: "eiK",
  canonicalId: "ci_TLB",
  slug: "lorcana-ci_TLB",
  printings: [
    {
      id: "set9-240-enchanted",
      artId: "ci_TLB-enchanted",
      setCode: "set9",
      collectorNumber: "240",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-178"],
  cardType: "character",
  name: "Jasmine",
  version: "Fearless Princess",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e0b8f2e97fc4d6ca8badbb552024f58",
    tcgPlayer: "651114",
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
  i18n: jasmineFearlessPrincessEnchantedI18n,
};
