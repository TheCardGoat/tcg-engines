import { forEachCharYouHaveInPlay } from "~/game-engine/engines/lorcana/src/abilities/amounts";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverThisCharSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunoMadrigalSingingSeer: LorcanaCharacterCardDefinition = {
  id: "ooe",
  name: "Bruno Madrigal",
  title: "Singing Seer",
  characteristics: ["floodborn", "ally", "madrigal"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
  type: "character",
  abilities: [
    shiftAbility(5, "Bruno Madrigal"),
    wheneverThisCharSings({
      name: "BRIGHT FUTURE",
      text: "Whenever this character sings a song, you may draw a card for each character you have in play.",
      optional: true,
      effects: [
        {
          type: "draw",
          amount: forEachCharYouHaveInPlay,
          target: self,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber", "amethyst"],
  cost: 7,
  strength: 3,
  willpower: 7,
  illustrator: "Milica Celikovic",
  number: 20,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
