import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentVengefulSorceressI18n } from "./054-maleficent-vengeful-sorceress.i18n";

export const maleficentVengefulSorceress: CharacterCard = {
  id: "vpH",
  canonicalId: "ci_vpH",
  slug: "lorcana-ci_vpH",
  printings: [
    {
      id: "set5-054",
      artId: "set5-054",
      setCode: "set5",
      collectorNumber: "54",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set5-054"],
  cardType: "character",
  name: "Maleficent",
  version: "Vengeful Sorceress",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 54,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9fce790e0b1c4e0788899b6eb0d6aad0",
    tcgPlayer: "560519",
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: maleficentVengefulSorceressI18n,
};
