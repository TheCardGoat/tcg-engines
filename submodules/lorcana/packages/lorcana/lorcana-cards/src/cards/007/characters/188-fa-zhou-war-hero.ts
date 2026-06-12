import type { CharacterCard } from "@tcg/lorcana-types";
import { faZhouWarHeroI18n } from "./188-fa-zhou-war-hero.i18n";

export const faZhouWarHero: CharacterCard = {
  id: "HVE",
  canonicalId: "ci_HVE",
  reprints: ["set7-188"],
  cardType: "character",
  name: "Fa Zhou",
  version: "War Hero",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 188,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c7f70b64da8740e0a6cc47d0862b88e3",
    tcgPlayer: 619515,
  },
  text: [
    {
      title: "TRAINING EXERCISES",
      description:
        "Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "turn-metric",
        metric: "challenges-by-player",
        playerScope: "you",
        comparison: {
          operator: "eq",
          value: 2,
        },
      },
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "1i5-1",
      name: "TRAINING EXERCISES",
      text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
      trigger: {
        event: "challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "defender-is-character" }],
      },
      type: "triggered",
    },
  ],
  i18n: faZhouWarHeroI18n,
};
