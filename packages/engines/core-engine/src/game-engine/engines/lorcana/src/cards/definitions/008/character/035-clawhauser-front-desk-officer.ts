import {
  bodyguardAbility,
  singerAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const clawhauserFrontDeskOfficer: LorcanaCharacterCardDefinition = {
  id: "he6",
  name: "Clawhauser",
  title: "Front Desk Officer",
  characteristics: ["storyborn", "ally", "detective"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSinger 4 (This character counts as cost 4 to sing songs.)",
  type: "character",
  abilities: [bodyguardAbility, singerAbility(4)],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Denny Minonne",
  number: 35,
  set: "008",
  rarity: "rare",
  lore: 2,
};
