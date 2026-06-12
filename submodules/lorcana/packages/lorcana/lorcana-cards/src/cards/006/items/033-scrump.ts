import type { ItemCard } from "@tcg/lorcana-types";
import { scrumpI18n } from "./033-scrump.i18n";

export const scrump: ItemCard = {
  id: "9I8",
  canonicalId: "ci_9I8",
  reprints: ["set6-033"],
  cardType: "item",
  name: "Scrump",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 33,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a631b5ead5b34dd4b89ae313a3dcbd1d",
    tcgPlayer: 592003,
  },
  text: [
    {
      title: "I MADE HER",
      description:
        "{E} one of your characters — Chosen character gets -2 {S} until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exertCharacters: 1,
      },
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "88v-1",
      name: "I MADE HER",
      text: "I MADE HER {E} one of your characters — Chosen character gets -2 {S} until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: scrumpI18n,
};
