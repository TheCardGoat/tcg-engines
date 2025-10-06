import { exertCharCost } from "~/game-engine/engines/lorcana/src/abilities";
import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theSwordOfShanYu: LorcanaItemCardDefinition = {
  id: "zlc",
  name: "The Sword Of Shan Yu",
  characteristics: ["item"],
  text: "WORTHY WEAPON {E}, {E} one of your characters – Ready chosen character. They can't quest for the rest of this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "WORTHY WEAPON",
      text: "{E}, {E} one of your characters – Ready chosen character. They can't quest for the rest of this turn.",
      costs: [{ type: "exert" }, exertCharCost(1)],
      effects: [...readyAndCantQuest(chosenCharacter)],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Domenico Russo",
  number: 152,
  set: "008",
  rarity: "rare",
};
