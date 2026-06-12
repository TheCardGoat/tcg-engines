import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSnowQueenI18n } from "./041-elsa-snow-queen.i18n";

export const elsaSnowQueen: CharacterCard = {
  id: "b3D",
  canonicalId: "ci_77P",
  reprints: ["set1-041", "set9-053"],
  cardType: "character",
  name: "Elsa",
  version: "Snow Queen",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 41,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2b5958e1524648629b663fb210bb7f76",
    tcgPlayer: 647660,
  },
  text: [
    {
      title: "FREEZE",
      description: "{E} — Exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "b3D-1",
      name: "FREEZE",
      text: "FREEZE {E} — Exert chosen opposing character.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: elsaSnowQueenI18n,
};
