import { propertyStaticAbilities } from "~/game-engine/engines/lorcana/src/abilities/propertyStaticAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cybugInvasiveEnemy: LorcanaCharacterCardDefinition = {
  id: "eku",
  name: "Cy-bug",
  title: "Invasive Enemy",
  characteristics: ["storyborn"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Cristian Romero",
  number: 127,
  set: "007",
  rarity: "uncommon",
  lore: 1,
  text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
  abilities: [
    propertyStaticAbilities({
      name: "Hive Mind",
      text: "This character gets +1 {S} for each other character you have in play.",
      attribute: "strength",
      amount: {
        dynamic: true,
        filters: [
          // TODO: I'm not sure why this is working, we should need to exclude himself from the sum as the text is `each other character`
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      },
    }),
  ],
};
