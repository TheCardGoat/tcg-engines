import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicaDeSpellCruelSorceress: LorcanitoCharacterCardDefinition = {
  id: "how",
  name: "Magica De Spell",
  title: "Cruel Sorceress",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**PLAYING WITH POWER** During opponents’ turns, if an effect would cause you to discard one or more cards from your hand, you don’t discard.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "meta",
      name: "PLAYING WITH POWER",
      text: "During opponents’ turns, if an effect would cause you to discard one or more cards from your hand, you don’t discard.",
      conditions: [
        {
          type: "during-turn",
          value: "opponent",
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Stefano Spagnuolo",
  number: 53,
  set: "SSK",
  rarity: "rare",
};
