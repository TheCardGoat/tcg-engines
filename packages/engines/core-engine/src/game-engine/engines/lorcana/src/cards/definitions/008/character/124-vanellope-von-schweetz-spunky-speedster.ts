import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vanellopeVonSchweetzSpunkySpeedster: LorcanaCharacterCardDefinition =
  {
    id: "os2",
    name: "Vanellope Von Schweetz",
    title: "Spunky Speedster",
    characteristics: ["storyborn", "hero", "princess", "racer"],
    text: "Evasive (Only characters with Evasive can challenge this character.)",
    type: "character",
    abilities: [evasiveAbility],
    inkwell: true,
    colors: ["ruby"],
    cost: 2,
    strength: 3,
    willpower: 1,
    illustrator: "French Carlomagno",
    number: 124,
    set: "008",
    rarity: "uncommon",
    lore: 1,
  };
