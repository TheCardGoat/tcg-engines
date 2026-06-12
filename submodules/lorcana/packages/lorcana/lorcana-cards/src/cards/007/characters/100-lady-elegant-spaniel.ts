import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyElegantSpanielI18n } from "./100-lady-elegant-spaniel.i18n";

export const ladyElegantSpaniel: CharacterCard = {
  id: "8jF",
  canonicalId: "ci_8jF",
  reprints: ["set7-100"],
  cardType: "character",
  name: "Lady",
  version: "Elegant Spaniel",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 100,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_923b464195ae4552b00f557378bc77a3",
    tcgPlayer: 618161,
  },
  text: [
    {
      title: "A DOG'S LIFE",
      description: "While you have a character named Tramp in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "14v-1",
      name: "A DOG'S LIFE",
      type: "static",
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Tramp",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
    },
  ],
  i18n: ladyElegantSpanielI18n,
};
