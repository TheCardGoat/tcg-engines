import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSnowQueenEpicI18n } from "./210-elsa-snow-queen-epic.i18n";

export const elsaSnowQueenEpic: CharacterCard = {
  id: "2yq",
  canonicalId: "ci_77P",
  slug: "lorcana-ci_77P",
  printings: [
    {
      id: "set9-210-epic",
      artId: "ci_77P-epic",
      setCode: "set9",
      collectorNumber: "210",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set1-041", "set9-053"],
  cardType: "character",
  name: "Elsa",
  version: "Snow Queen",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2b5958e1524648629b663fb210bb7f76",
    tcgPlayer: "647660",
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
  i18n: elsaSnowQueenEpicI18n,
};
