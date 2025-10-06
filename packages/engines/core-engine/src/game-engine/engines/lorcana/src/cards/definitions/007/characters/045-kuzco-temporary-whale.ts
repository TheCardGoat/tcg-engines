import { targetOwnerDrawsXCards } from "@lorcanito/lorcana-engine/effects/effects";
import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoTemporaryWhale: LorcanaCharacterCardDefinition = {
  notImplemented: true,
  id: "wof",
  name: "Kuzco",
  title: "Temporary Whale",
  characteristics: ["storyborn", "king"],
  text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "DON'T YOU SAY A WORD",
      text: "Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
      optional: true,
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              {
                filter: "type",
                value: ["character", "item", "location"],
              },
              {
                filter: "attribute",
                value: "cost",
                comparison: {
                  operator: "lte",
                  value: 2,
                },
              },
            ],
          },
        },
        targetOwnerDrawsXCards(1),
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  strength: 1,
  willpower: 4,
  illustrator: "Luca Pinnelli",
  number: 45,
  set: "007",
  rarity: "rare",
  lore: 2,
};
