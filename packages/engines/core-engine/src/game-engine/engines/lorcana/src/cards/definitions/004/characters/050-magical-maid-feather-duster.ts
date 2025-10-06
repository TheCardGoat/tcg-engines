import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicalMaidFeatherDuster: LorcanaCharacterCardDefinition = {
  id: "dx1",
  name: "Magical Maid",
  title: "Feather Duster",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    'Have you ever seen anything so beautiful?" she asked, marveling at the Amethyst trees.\n"No, cherie," Lumiere replied, never taking his eyes off her. "I have not."',
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Natalia Trykowska",
  number: 50,
  set: "URR",
  rarity: "uncommon",
};
