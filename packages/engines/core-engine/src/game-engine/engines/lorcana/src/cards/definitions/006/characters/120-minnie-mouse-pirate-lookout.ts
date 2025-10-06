// TODO: Once the set is released, we organize the cards by set and type

import { returnLocationFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMousePirateLookout: LorcanaCharacterCardDefinition = {
  id: "lm2",
  name: "Minnie Mouse",
  title: "Pirate Lookout",
  characteristics: ["dreamborn", "hero", "pirate"],
  text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Land, Ho!",
      text: "Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
      optional: true,
      conditions: [{ type: "during-turn", value: "self" }],
      oncePerTurn: true,
      effects: [returnLocationFromDiscardToHand],
    }),
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 120,
  set: "006",
  rarity: "super_rare",
};
