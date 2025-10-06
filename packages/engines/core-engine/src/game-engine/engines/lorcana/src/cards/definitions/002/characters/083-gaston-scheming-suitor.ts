import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonSchemingSuitor: LorcanaCharacterCardDefinition = {
  id: "eck",
  name: "Gaston",
  title: "Scheming Suitor",
  characteristics: ["storyborn", "villain"],
  text: "**YES, I'M INTIMIDATING** While one or more opponents have no cards in their hands, this character gets +3 {S}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Yes, I'm Intimidating",
      text: "While one or more opponents have no cards in their hands, this character gets +3 {S}.",
      conditions: [{ type: "hand", amount: 0, player: "opponent" }],
      attribute: "strength",
      amount: 3,
    }),
  ],
  flavour: '"Don\'t I deserve the best?"',
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Valerio Buonfantino",
  number: 83,
  set: "ROF",
  rarity: "common",
};
