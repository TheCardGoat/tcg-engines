import type { CharacterCard } from "@tcg/lorcana-types";
import { sarabiProtectingThePrideI18n } from "./012-sarabi-protecting-the-pride.i18n";

export const sarabiProtectingThePride: CharacterCard = {
  id: "EYo",
  canonicalId: "ci_EYo",
  reprints: ["set11-012"],
  cardType: "character",
  name: "Sarabi",
  version: "Protecting the Pride",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "011",
  cardNumber: 12,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7820a5ea1cc44b97b4b5aeb89fc1882a",
    tcgPlayer: 676187,
  },
  text: [
    {
      title: "FEARSOME SNARL",
      description: "{E} — Chosen opposing character gets -4 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Queen"],
  abilities: [
    {
      id: "m08-1",
      name: "FEARSOME SNARL",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        modifier: -4,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
        duration: "until-start-of-next-turn",
      },
      text: "FEARSOME SNARL {E} - Chosen opposing character gets -4 {S} until the start of your next turn.",
    },
  ],
  i18n: sarabiProtectingThePrideI18n,
};
