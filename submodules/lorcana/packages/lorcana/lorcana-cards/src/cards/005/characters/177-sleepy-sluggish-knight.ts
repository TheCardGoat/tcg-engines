import type { CharacterCard } from "@tcg/lorcana-types";
import { sleepySluggishKnightI18n } from "./177-sleepy-sluggish-knight.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const sleepySluggishKnight: CharacterCard = {
  id: "72x",
  canonicalId: "ci_72x",
  reprints: ["set5-177"],
  cardType: "character",
  name: "Sleepy",
  version: "Sluggish Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 177,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4de6cdcaa4d946e5bf5f63d07f8d1b8b",
    tcgPlayer: 559664,
  },
  text: "Bodyguard",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [bodyguard],
  i18n: sleepySluggishKnightI18n,
};
