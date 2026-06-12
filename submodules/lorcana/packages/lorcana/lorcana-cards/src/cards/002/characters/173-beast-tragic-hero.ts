import type { CharacterCard } from "@tcg/lorcana-types";
import { beastTragicHeroI18n } from "./173-beast-tragic-hero.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const beastTragicHero: CharacterCard = {
  id: "VVb",
  canonicalId: "ci_VVb",
  reprints: ["set2-173"],
  cardType: "character",
  name: "Beast",
  version: "Tragic Hero",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 173,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7ffeed1a4c364378ab7814dda3b99b73",
    tcgPlayer: 527629,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "IT'S BETTER THIS WAY",
      description:
        "At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(3),
    {
      id: "kyf-2",
      name: "IT'S BETTER THIS WAY",
      text: "IT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "no-damage",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        else: {
          duration: "this-turn",
          modifier: 4,
          stat: "strength",
          target: "SELF",
          type: "modify-stat",
        },
      },
    },
  ],
  i18n: beastTragicHeroI18n,
};
