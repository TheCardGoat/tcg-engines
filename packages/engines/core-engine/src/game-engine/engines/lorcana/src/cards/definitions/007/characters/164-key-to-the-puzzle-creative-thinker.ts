import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { ScryEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import {
  type ActivatedAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const scry: ScryEffect = {
  type: "scry",
  amount: 2,
  mode: "inkwell",
  shouldRevealTutored: false,
  target: self,
  tutorFilters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "deck" },
  ],
  limits: {
    bottom: 0,
    hand: 0,
    top: 1,
    inkwell: 1,
  },
};

const keyToThePuzzle: ActivatedAbility = {
  type: "activated",
  name: "KEY TO THE PUZZLE",
  text: "{E} – Look at the top 2 cards of your deck. Put one into your inkwell facedown and exerted, and the other on top of your deck.",
  costs: [{ type: "exert" }],
  effects: [scry],
};

export const kidaCreativeThinker: LorcanaCharacterCardDefinition = {
  id: "m5r",
  name: "Kida",
  title: "Creative Thinker",
  characteristics: ["storyborn", "hero", "princess"],
  text: "Ward\nKEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your inkwell  facedown and exerted, and the other on top of your deck.",
  type: "character",
  abilities: [wardAbility, keyToThePuzzle],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Jennifer Park / Leonardo Giammichele",
  number: 164,
  set: "007",
  rarity: "rare",
  lore: 1,
};
