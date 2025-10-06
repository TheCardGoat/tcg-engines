// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnDarlingDistinguishedSwordsman: LorcanaCharacterCardDefinition =
  {
    id: "n84",
    name: "John Darling",
    title: "Sophisticated Swordsman",
    characteristics: ["storyborn", "ally", "pirate"],
    type: "character",
    inkwell: true,
    colors: ["ruby"],
    cost: 2,
    strength: 1,
    willpower: 4,
    lore: 1,
    illustrator: "Filippo Laurentino",
    number: 118,
    set: "006",
    rarity: "uncommon",
  };
