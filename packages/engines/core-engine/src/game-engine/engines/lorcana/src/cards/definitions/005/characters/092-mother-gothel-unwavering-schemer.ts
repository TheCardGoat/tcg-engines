import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { returnCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motherGothelUnwaveringSchemer: LorcanitoCharacterCardDefinition = {
  id: "uis",
  missingTestCase: true,
  name: "Mother Gothel",
  title: "Unwavering Schemer",
  characteristics: ["floodborn", "villain"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Mother Gothel.)_ **THE WORLD IS DARK** When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
  type: "character",
  abilities: [
    shiftAbility(4, "Mother Gothel"),
    {
      type: "resolution",
      name: "**THE WORLD IS DARK**",
      text: "When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
      responder: "opponent",
      effects: [returnCardToHand(chosenCharacterOfYours)],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  illustrator: "Dylan Bonner",
  number: 92,
  set: "SSK",
  rarity: "super_rare",
};
