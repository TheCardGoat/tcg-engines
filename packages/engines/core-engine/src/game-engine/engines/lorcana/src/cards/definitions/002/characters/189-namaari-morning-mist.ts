import {
  bodyguardAbility,
  challengeReadyCharacters,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const namaariMorningMist: LorcanitoCharacterCardDefinition = {
  id: "mpn",

  name: "Namaari",
  title: "Morning Mist",
  characteristics: ["storyborn", "villain", "princess"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**BLADES** This character can challenge ready characters.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      ...challengeReadyCharacters,
      name: "Blades",
      text: "This character can challenge ready characters.",
    },
  ],
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 189,
  set: "ROF",
  rarity: "legendary",
};
