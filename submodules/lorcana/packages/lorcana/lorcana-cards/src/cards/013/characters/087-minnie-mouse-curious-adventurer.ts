import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseCuriousAdventurerI18n } from "./087-minnie-mouse-curious-adventurer.i18n";

export const minnieMouseCuriousAdventurer: CharacterCard = {
  id: "J61",
  canonicalId: "ci_J61",
  slug: "lorcana-ci_J61",
  printings: [
    {
      id: "set13-087",
      artId: "set13-087",
      setCode: "set13",
      collectorNumber: "87",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-087"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Curious Adventurer",
  inkType: ["emerald"],
  set: "013",
  cardNumber: 87,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Dreamborn", "Hero"],
  i18n: minnieMouseCuriousAdventurerI18n,
};
