import type { CharacterCard } from "@tcg/lorcana-types";
import { davidImpressiveSurferI18n } from "./008-david-impressive-surfer.i18n";

export const davidImpressiveSurfer: CharacterCard = {
  id: "Xi4",
  canonicalId: "ci_Xi4",
  reprints: ["set6-008"],
  cardType: "character",
  name: "David",
  version: "Impressive Surfer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4e3967f948654fc9a2d9595743e1709f",
    tcgPlayer: 592006,
  },
  text: [
    {
      title: "SHOWING OFF",
      description: "While you have a character named Nani in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Nani",
        controller: "you",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "mrs-1",
      name: "SHOWING OFF",
      text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: davidImpressiveSurferI18n,
};
