import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import {
  chosenCharacterNamed,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const faZhouMulansFather: LorcanaCharacterCardDefinition = {
  id: "ex8",
  missingTestCase: true,
  name: "Fa Zhou",
  title: "Mulan's Father",
  characteristics: ["storyborn", "mentor"],
  text: "**WAR WOUND** This character cannot challenge.\n\n\n**HEAD OF FAMILY** {E} - Ready chosen character named Mulan. They can't quest for the rest of the turn.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "War Wound",
      text: "This character cannot challenge.",
      effects: [
        {
          type: "restriction",
          restriction: "challenge",
          target: thisCharacter,
        },
      ],
    },
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "Head of Family",
      text: "{E} - Ready chosen character named Mulan. They can't quest for the rest of the turn.",
      effects: readyAndCantQuest(chosenCharacterNamed("mulan")),
    },
  ],
  flavour: '"I am ready to serve the Emperor."',
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  willpower: 4,
  strength: 0,
  lore: 1,
  illustrator: "Carmine Pucci",
  number: 105,
  set: "URR",
  rarity: "common",
};
