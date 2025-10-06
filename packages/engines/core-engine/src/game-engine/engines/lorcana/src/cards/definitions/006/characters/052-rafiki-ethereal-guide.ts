// TODO: Once the set is released, we organize the cards by set and type

import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rafikiEtherealGuide: LorcanaCharacterCardDefinition = {
  id: "zox",
  missingTestCase: true,
  name: "Rafiki",
  title: "Ethereal Guide",
  characteristics: ["floodborn", "mentor", "sorcerer"],
  text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(7, "Rafiki"),
    wheneverACardIsPutIntoYourInkwell({
      name: "Astral Attunement",
      text: "During your turn, whenever a card is put into your inkwell, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  illustrator: "Sam Nielson",
  number: 52,
  set: "006",
  rarity: "rare",
};
