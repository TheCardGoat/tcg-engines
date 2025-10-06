import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rancisFluggerbutterChocolateCharger: LorcanitoCharacterCardDefinition =
  {
    id: "kcc",
    name: "Rancis Fluggerbutter",
    title: "Chocolate Charger",
    characteristics: ["storyborn", "ally", "racer"],
    type: "character",
    flavour:
      "Ingredients: Butter, sugar, unsweetened chocolate, vanilla, and arrogance.",
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 4,
    willpower: 4,
    lore: 1,
    illustrator: "Ellie Horie",
    number: 108,
    set: "SSK",
    rarity: "common",
  };
