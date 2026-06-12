import type { CharacterCard } from "@tcg/lorcana-types";
import { scarMastermindI18n } from "./158-scar-mastermind.i18n";

export const scarMastermind: CharacterCard = {
  id: "yBp",
  canonicalId: "ci_yBp",
  reprints: ["set1-158"],
  cardType: "character",
  name: "Scar",
  version: "Mastermind",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 158,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_39139dbf0feb48b1924d20cc03c58d47",
    tcgPlayer: 485360,
  },
  text: [
    {
      title: "INSIDIOUS PLOT",
      description: "When you play this character, chosen opposing character gets -5 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1nb-1",
      name: "INSIDIOUS PLOT",
      text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scarMastermindI18n,
};
