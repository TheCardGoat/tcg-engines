import type { CharacterCard } from "@tcg/lorcana-types";
import { yokaiProfessorCallaghanI18n } from "./158-yokai-professor-callaghan.i18n";

export const yokaiProfessorCallaghan: CharacterCard = {
  id: "sac",
  canonicalId: "ci_sac",
  slug: "lorcana-ci_sac",
  printings: [
    {
      id: "set6-158",
      artId: "set6-158",
      setCode: "set6",
      collectorNumber: "158",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set6-158"],
  cardType: "character",
  name: "Yokai",
  version: "Professor Callaghan",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 158,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fbf237baa9744eb19ca3d4e6c280d587",
    tcgPlayer: "587973",
  },
  classifications: ["Storyborn", "Villain", "Inventor"],
  i18n: yokaiProfessorCallaghanI18n,
};
