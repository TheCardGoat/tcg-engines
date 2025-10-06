import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jumbaJokibaaRenegadeScientist: LorcanaCharacterCardDefinition = {
  id: "n85",

  name: "Jumba Jookiba",
  title: "Renegade Scientist",
  characteristics: ["dreamborn", "alien", "inventor"],
  type: "character",
  flavour:
    '"Created something? Ha! But that would be irresponsible and unethical. I would never, ever . . . make more than one."',
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Milica Celikovic",
  number: 83,
  set: "TFC",
  rarity: "uncommon",
};
