import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaVanessa: LorcanitoCharacterCardDefinition = {
  id: "se6",
  reprints: ["iye"],
  name: "Ursula",
  title: "Vanessa",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(4)],
  flavour: "This magic will certainly do the trick.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Angela Simpson",
  number: 25,
  set: "URR",
  rarity: "common",
};
