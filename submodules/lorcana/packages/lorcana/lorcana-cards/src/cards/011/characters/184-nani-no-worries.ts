import type { CharacterCard } from "@tcg/lorcana-types";
import { naniNoWorriesI18n } from "./184-nani-no-worries.i18n";

export const naniNoWorries: CharacterCard = {
  id: "wNB",
  canonicalId: "ci_wNB",
  reprints: ["set11-184"],
  cardType: "character",
  name: "Nani",
  version: "No Worries",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 184,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b10b1d80d4a94ec5b2ed59c1318bb046",
    tcgPlayer: 673760,
  },
  text: [
    {
      title: "TAKE IT EASY",
      description: "While this character has no damage, she gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "1iz-1",
      name: "TAKE IT EASY",
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "TAKE IT EASY While this character has no damage, she gets +1 {L}.",
    },
  ],
  i18n: naniNoWorriesI18n,
};
