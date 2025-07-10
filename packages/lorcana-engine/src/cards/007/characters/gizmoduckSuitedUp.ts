import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const gizmoduckSuitedUp: LorcanitoCharacterCard = {
  id: "g90",
  name: "Gizmoduck",
  title: "Suited Up",
  characteristics: ["storyborn", "inventor"],
  text: "Resist +1\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
  type: "character",
  abilities: [
    resistAbility(1),
    {
      type: "static",
      ability: "challenge-ready-damaged-chars",
      name: "BLATHERING BLATHERSKITE",
      text: "This character can challenge ready damaged characters.",
    },
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "steel"],
  cost: 4,
  strength: 4,
  willpower: 3,
  illustrator: "Cam Kendell",
  number: 105,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
