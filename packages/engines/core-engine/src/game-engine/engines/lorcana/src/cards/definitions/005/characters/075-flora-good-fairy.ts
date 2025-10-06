import { reverseChallenge } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const floraGoodFairy: LorcanitoCharacterCardDefinition = {
  id: "bw1",
  missingTestCase: true,
  name: "Flora",
  title: "Good Fairy",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**FIDDLE FADDLE** While being challenged, this character gets +2 {S}.",
  type: "character",
  abilities: [reverseChallenge("Fiddle Faddle", 2)],
  flavour:
    "Don't fuss, dear! A flick of the wrist will turn these briars into something beautiful.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Eri Weli",
  number: 75,
  set: "SSK",
  rarity: "common",
};
