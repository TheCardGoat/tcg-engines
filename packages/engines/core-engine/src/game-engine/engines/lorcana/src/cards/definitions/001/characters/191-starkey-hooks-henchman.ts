import { haveCaptainInPlay } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const starkeyHooksHenchman: LorcanaCharacterCardDefinition = {
  id: "wxx",

  name: "Starkey",
  title: "Hook's Henchman",
  characteristics: ["storyborn", "pirate", "ally"],
  text: "**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Ay Aye, Captain",
      text: "While you have a Captain character in play, this character gets +1 {L}.",
      conditions: [haveCaptainInPlay],
      attribute: "lore",
      amount: 1,
    }),
  ],
  flavour:
    "A pirate must be tough, loyal, and strong. Smart doesn't even make the list.",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 191,
  set: "TFC",
  rarity: "uncommon",
};
