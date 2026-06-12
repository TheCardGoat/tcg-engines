import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinSquirrelI18n } from "./054-merlin-squirrel.i18n";

export const merlinSquirrel: CharacterCard = {
  id: "sGp",
  canonicalId: "ci_sGp",
  reprints: ["set2-054"],
  cardType: "character",
  name: "Merlin",
  version: "Squirrel",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 54,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_68c2d4e87fa84e0bb650d5e2b9c0737b",
    tcgPlayer: 522209,
  },
  text: [
    {
      title: "LOOK BEFORE YOU LEAP",
      description:
        "When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1qe-1",
      name: "LOOK BEFORE YOU LEAP",
      text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1qe-2",
      name: "LOOK BEFORE YOU LEAP",
      text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinSquirrelI18n,
};
