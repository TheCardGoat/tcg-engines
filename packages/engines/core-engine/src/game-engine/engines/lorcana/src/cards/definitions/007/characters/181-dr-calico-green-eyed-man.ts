import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drCalicoGreeneyedMan: LorcanaCharacterCardDefinition = {
  id: "q5s",
  name: "Dr. Calico",
  title: "Green-Eyed Man",
  characteristics: ["storyborn", "villain"],
  text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
  type: "character",
  abilities: [
    {
      ...resistAbility(2),
      condition: [{ type: "damage", comparison: { operator: "eq", value: 0 } }],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Wouter Bruneel",
  number: 181,
  set: "007",
  rarity: "common",
  lore: 1,
};
