import { eachCharacterInPlay } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

export const lyleTiberiusRourkeCrystallizedMercenary: LorcanitoCharacterCard = {
  id: "vvm",
  name: "Lyle Tiberius Rourke",
  title: "Crystallized Mercenary",
  characteristics: ["storyborn", "villain"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  strength: 6,
  willpower: 4,
  illustrator: "Federico Maria Cugliari",
  number: 140,
  set: "007",
  rarity: "rare",
  lore: 2,
  text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Explosive",
      text: "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
      effects: [dealDamageEffect(2, eachCharacterInPlay)],
      oncePerTurn: true,
    }),
  ],
};
