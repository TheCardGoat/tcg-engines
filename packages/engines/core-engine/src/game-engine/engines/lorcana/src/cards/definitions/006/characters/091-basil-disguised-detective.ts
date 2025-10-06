import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilDisguisedDetective: LorcanaCharacterCardDefinition = {
  id: "pwe",
  name: "Basil",
  title: "Disguised Detective",
  characteristics: ["floodborn", "hero", "detective"],
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
  type: "character",
  abilities: [
    shiftAbility(4, "Basil"),
    wheneverACardIsPutIntoYourInkwell({
      name: "Twists and Turns",
      text: "During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
      costs: [{ type: "ink", amount: 1 }],
      conditions: [duringYourTurn],
      optional: true,
      effects: [
        {
          type: "create-layer-for-player",
          target: { type: "player", value: "opponent" },
          layer: {
            responder: "opponent",
            type: "resolution",
            optional: false,
            effects: [
              {
                type: "discard",
                amount: 1,
                target: {
                  type: "card",
                  value: 1,
                  filters: [
                    { filter: "zone", value: "hand" },
                    { filter: "owner", value: "self" },
                  ],
                },
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Stefano Spagnuolo",
  number: 91,
  set: "006",
  rarity: "uncommon",
};
