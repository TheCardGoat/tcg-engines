import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const painUnderworldImp: LorcanaCharacterCardDefinition = {
  id: "hrt",
  name: "Pain",
  title: "Underworld Imp",
  characteristics: ["storyborn", "ally"],
  text: "**COMING, YOUR MOST LUGUBRIOUSNESS** While this character has 5 {S} or more, he gets + 2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Coming, Your Most Lugubriousness",
      text: "While this character has 5 {S} or more, he gets + 2 {L}.",
      attribute: "lore",
      amount: 2,
      conditions: [
        {
          type: "attribute",
          attribute: "strength",
          comparison: { operator: "gte", value: 5 },
        },
      ],
    }),
  ],
  flavour:
    '"Get a move on! I\'m a busy god, lots to do−meetings, curses, a little light scheming." \\n−Hades',
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Kristina Chouri / Mariana Moreno",
  number: 86,
  set: "ROF",
  rarity: "uncommon",
};
