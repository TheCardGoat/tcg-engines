import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { eachCharacterInPlay } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lyleTiberiusRourkeCrystallizedMercenary: LorcanaCharacterCardDefinition =
  {
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
    lore: 3,
    text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
    abilities: [
      wheneverACardIsPutIntoYourInkwell({
        name: "Explosive",
        text: "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
        effects: [dealDamageEffect(2, eachCharacterInPlay)],
        oncePerTurn: true,
        conditions: [duringYourTurn],
      }),
    ],
  };
