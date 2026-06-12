import type { CharacterCard } from "@tcg/lorcana-types";
import { basilTenaciousMouseI18n } from "./179-basil-tenacious-mouse.i18n";

export const basilTenaciousMouse: CharacterCard = {
  id: "1XP",
  canonicalId: "ci_1XP",
  reprints: ["set10-179"],
  cardType: "character",
  name: "Basil",
  version: "Tenacious Mouse",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  cardNumber: 179,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5047361d5e154f1099d8996c8904fb2d",
    tcgPlayer: 658783,
  },
  text: [
    {
      title: "HOLD YOUR GROUND",
      description:
        "Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "l21-1",
      name: "HOLD YOUR GROUND",
      text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Detective",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: basilTenaciousMouseI18n,
};
