import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletHunnyMageApprenticeI18n } from "./154-piglet-hunny-mage-apprentice.i18n";

export const pigletHunnyMageApprentice: CharacterCard = {
  id: "ckw",
  canonicalId: "ci_ckw",
  slug: "lorcana-ci_ckw",
  printings: [
    {
      id: "set13-154",
      artId: "set13-154",
      setCode: "set13",
      collectorNumber: "154",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-154"],
  cardType: "character",
  name: "Piglet",
  version: "Hunny Mage Apprentice",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 154,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Dreamborn", "Ally", "Sorcerer", "Hunny"],
  i18n: pigletHunnyMageApprenticeI18n,
};
