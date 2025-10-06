import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  type EffectStaticAbility,
  singerAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const justWannaStayAtHome: EffectStaticAbility = {
  name: "I JUST WANNA STAY HOME",
  text: "This character can't move to locations.",
  type: "static",
  ability: "effects",
  target: thisCharacter, // Without this the ability can't target itself... The engine is so confusing
  effects: [
    {
      type: "restriction",
      restriction: "move-to-location",
      target: thisCharacter,
    },
  ],
};

export const maxGoofRockinTeen: LorcanaCharacterCardDefinition = {
  id: "ob7",
  name: "Max Goof",
  title: "Rockin' Teen",
  characteristics: ["storyborn", "hero"],
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 4,
  willpower: 3,
  illustrator: "Stefano Spagnuolo",
  number: 112,
  set: "009",
  rarity: "common",
  abilities: [singerAbility(5), justWannaStayAtHome],
  lore: 1,
};
