import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const atlanticaConcertHall: LorcanaLocationCardDefinition = {
  id: "xt0",
  reprints: ["wzf"],
  name: "Atlantica",
  title: "Concert Hall",
  characteristics: ["location"],
  text: "**UNDERWATER ACOUSTICS** Characters count as having +2 cost to sing songs while here.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Underwater Acoustics",
      text: "Characters count as having +2 cost to sing songs while here.",
      ability: {
        type: "static",
        ability: "effects",
        name: "Underwater Acoustics",
        text: "Characters count as having +2 cost to sing songs while here.",
        effects: [
          {
            type: "attribute",
            attribute: "singCost",
            amount: 2,
            modifier: "add",
            target: thisCharacter,
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  moveCost: 2,
  willpower: 6,
  illustrator: "Alex Shin",
  number: 33,
  set: "URR",
  rarity: "common",
};
