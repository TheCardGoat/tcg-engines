import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mittensSassyStreetCat: LorcanaCharacterCardDefinition = {
  id: "cf8",
  name: "Mittens",
  title: "Sassy Street Cat",
  characteristics: ["dreamborn", "ally"],
  text: "Bodyguard\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
  type: "character",
  abilities: [
    bodyguardAbility,
    wheneverACardIsPutIntoYourInkwell({
      name: "NO THANKS NECESSARY",
      text: "Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "source", value: "other" },
              { filter: "ability", value: "bodyguard" },
            ],
          },
          amount: 1,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 5,
  illustrator: "Brian Weisz",
  number: 9,
  set: "007",
  rarity: "rare",
  lore: 2,
};
