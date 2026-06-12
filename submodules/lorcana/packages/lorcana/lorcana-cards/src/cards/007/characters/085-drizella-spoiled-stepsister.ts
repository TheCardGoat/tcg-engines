import type { CharacterCard } from "@tcg/lorcana-types";
import { drizellaSpoiledStepsisterI18n } from "./085-drizella-spoiled-stepsister.i18n";

export const drizellaSpoiledStepsister: CharacterCard = {
  id: "ZR7",
  canonicalId: "ci_ZR7",
  reprints: ["set7-085"],
  cardType: "character",
  name: "Drizella",
  version: "Spoiled Stepsister",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 85,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_40f1a53c285d48ca863b57072d362b48",
    tcgPlayer: 619452,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: drizellaSpoiledStepsisterI18n,
};
