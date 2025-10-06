// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drDelbertDopplerPreciseAstronomer: LorcanaCharacterCardDefinition =
  {
    id: "ywl",
    name: "Dr. Delbert Doppler",
    title: "Fussy Astronomer",
    characteristics: ["storyborn", "ally", "alien"],
    type: "character",
    inkwell: true,
    colors: ["sapphire"],
    cost: 4,
    strength: 4,
    willpower: 4,
    lore: 1,
    illustrator: "Valentina Grajuso",
    number: 152,
    set: "006",
    rarity: "uncommon",
  };
