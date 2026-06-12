import type { CharacterCard } from "@tcg/lorcana-types";
import { tukeNorthernMooseI18n } from "./007-tuke-northern-moose.i18n";

export const tukeNorthernMoose: CharacterCard = {
  id: "GYp",
  canonicalId: "ci_GYp",
  reprints: ["set5-007"],
  cardType: "character",
  name: "Tuke",
  version: "Northern Moose",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 7,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_461c6287b34c4be19933bac34f7c7d78",
    tcgPlayer: 560496,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tukeNorthernMooseI18n,
};
