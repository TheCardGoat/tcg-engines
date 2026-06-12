import type { CharacterCard } from "@tcg/lorcana-types";
import { jimDearBelovedHusbandI18n } from "./012-jim-dear-beloved-husband.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const jimDearBelovedHusband: CharacterCard = {
  id: "3Cr",
  canonicalId: "ci_3Cr",
  reprints: ["set8-012"],
  cardType: "character",
  name: "Jim Dear",
  version: "Beloved Husband",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 12,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_18b8e544b96748dc9950322a3fcb5cf8",
    tcgPlayer: 631356,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: jimDearBelovedHusbandI18n,
};
