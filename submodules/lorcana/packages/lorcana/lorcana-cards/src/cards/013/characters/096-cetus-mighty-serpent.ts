import type { CharacterCard } from "@tcg/lorcana-types";
import { cetusMightySerpentI18n } from "./096-cetus-mighty-serpent.i18n";

export const cetusMightySerpent: CharacterCard = {
  id: "rAy",
  canonicalId: "ci_rAy",
  slug: "lorcana-ci_rAy",
  printings: [
    {
      id: "set13-096",
      artId: "set13-096",
      setCode: "set13",
      collectorNumber: "96",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-096"],
  cardType: "character",
  name: "Cetus",
  version: "Mighty Serpent",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 96,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Monster"],
  i18n: cetusMightySerpentI18n,
};
