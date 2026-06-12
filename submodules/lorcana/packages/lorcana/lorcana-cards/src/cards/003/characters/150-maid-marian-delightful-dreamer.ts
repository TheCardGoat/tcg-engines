import type { CharacterCard } from "@tcg/lorcana-types";
import { maidMarianDelightfulDreamerI18n } from "./150-maid-marian-delightful-dreamer.i18n";

export const maidMarianDelightfulDreamer: CharacterCard = {
  id: "q9a",
  canonicalId: "ci_31G",
  reprints: ["set3-150", "set9-158"],
  cardType: "character",
  name: "Maid Marian",
  version: "Delightful Dreamer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 150,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_73c0d376411b4b588a9de5cc5644e4bb",
    tcgPlayer: 650093,
  },
  text: [
    {
      title: "HIGHBORN LADY",
      description: "When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Princess"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1p6-1",
      name: "HIGHBORN LADY",
      text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maidMarianDelightfulDreamerI18n,
};
