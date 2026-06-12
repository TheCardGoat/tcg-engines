import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentSorceressI18n } from "./049-maleficent-sorceress.i18n";

export const maleficentSorceress: CharacterCard = {
  id: "H9N",
  canonicalId: "ci_H9N",
  reprints: ["set1-049"],
  cardType: "character",
  name: "Maleficent",
  version: "Sorceress",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 49,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ff8bf99d2bd84183bcc4b5d7a18360f0",
    tcgPlayer: 494103,
  },
  text: [
    {
      title: "CAST MY SPELL!",
      description: "When you play this character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "1la-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "CAST MY SPELL!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CAST MY SPELL! When you play this character, you may draw a card.",
    },
  ],
  i18n: maleficentSorceressI18n,
};
