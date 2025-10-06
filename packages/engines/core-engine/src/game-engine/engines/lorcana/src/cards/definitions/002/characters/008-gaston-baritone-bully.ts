import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonBaritoneBully: LorcanaCharacterCardDefinition = {
  id: "j47",
  name: "Gaston",
  title: "Baritone Bully",
  characteristics: ["dreamborn", "villain"],
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(5)],
  flavour: "No one . . . sings like Gaston!",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Jochem Van Gool",
  number: 8,
  set: "ROF",
  rarity: "uncommon",
};
