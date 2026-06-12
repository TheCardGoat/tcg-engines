import type { CharacterCard } from "@tcg/lorcana-types";
import { davidProtectiveSnowboarderI18n } from "./009-david-protective-snowboarder.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const davidProtectiveSnowboarder: CharacterCard = {
  id: "qaR",
  canonicalId: "ci_qaR",
  reprints: ["set11-009"],
  cardType: "character",
  name: "David",
  version: "Protective Snowboarder",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 9,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b5db84fe81624162968c99d1ca9ee5af",
    tcgPlayer: 674826,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: davidProtectiveSnowboarderI18n,
};
