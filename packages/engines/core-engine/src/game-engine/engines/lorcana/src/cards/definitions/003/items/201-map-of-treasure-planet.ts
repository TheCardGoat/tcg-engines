import { yourOtherCharactersGet } from "~/game-engine/engines/lorcana/src/abilities";
import { youPayXLessToPlayNextLocationThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { yourLocationCards } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mapOfTreasurePlanet: LorcanaItemCardDefinition = {
  id: "x73",
  name: "Map of Treasure Planet",
  characteristics: ["item"],
  text: "**KEY TO THE PORTAL** {E} – You pay 1 {I} less for the next location you play this turn.\n\n\n**SHOW THE WAY** You pay 1 {I} less to move your characters to a location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "**KEY TO THE PORTAL**",
      text: "{E} – You pay 1 {I} less for the next location you play this turn.",
      effects: [youPayXLessToPlayNextLocationThisTurn(1)],
    },
    yourOtherCharactersGet({
      name: "Show the Way",
      text: "You pay 1 {I} less to move your characters to a location.",
      effects: [
        {
          type: "attribute",
          attribute: "moveCost",
          amount: 1,
          modifier: "subtract",
          target: yourLocationCards,
        },
      ],
    }),
  ],
  flavour: "Gentlemen, this must be kept under lock and key. \n−Captain Amelia",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Gabriel Angelo",
  number: 201,
  set: "ITI",
  rarity: "rare",
};
