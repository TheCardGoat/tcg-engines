// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gadgetHackwrenchPerceptiveMouse: LorcanitoCharacterCardDefinition =
  {
    id: "x39",
    name: "Gadget Hackwrench",
    title: "Perceptive Mouse",
    characteristics: ["storyborn", "ally", "inventor"],
    type: "character",
    abilities: [],
    inkwell: true,
    colors: ["sapphire"],
    cost: 2,
    strength: 2,
    willpower: 3,
    lore: 1,
    illustrator: "Simanta Edini",
    number: 151,
    set: "006",
    rarity: "common",
  };
