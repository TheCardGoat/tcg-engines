import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { violetSabrewingSeniorJuniorWoodchuckI18n } from "./044-violet-sabrewing-senior-junior-woodchuck.i18n";

export const violetSabrewingSeniorJuniorWoodchuck: CharacterCard = {
  id: "erF",
  canonicalId: "ci_erF",
  reprints: ["set10-044"],
  cardType: "character",
  name: "Violet Sabrewing",
  version: "Senior Junior Woodchuck",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 44,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e4756264eee4c9a8e6043984cba2c1d",
    tcgPlayer: 658458,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: violetSabrewingSeniorJuniorWoodchuckI18n,
};
