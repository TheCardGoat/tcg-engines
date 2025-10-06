import { opponentAsResponderExertOneOfTheirReadyCharacters } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaEagerAcolyte: LorcanaCharacterCardDefinition = {
  id: "eqi",
  name: "Anna",
  title: "Eager Acolyte",
  characteristics: ["hero", "dreamborn", "queen"],
  text: "**GROWING POWERS** When you play this character, each opponent chooses and exerts on of their ready characters.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "GROWING POWERS",
      text: "When you play this character, each opponent choses and exerts on of their ready characters.",
      responder: "opponent",
      effects: [opponentAsResponderExertOneOfTheirReadyCharacters],
    },
  ],
  flavour:
    "Okay, I can totally move small stuff. I need something bigger... Where's Kristoff's sled?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Leonardo Gimmichele",
  number: 56,
  set: "SSK",
  rarity: "common",
};
