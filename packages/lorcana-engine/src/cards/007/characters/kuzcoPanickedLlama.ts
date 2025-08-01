import {
  evasiveAbility,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import {
  discardACard,
  drawXCards,
} from "@lorcanito/lorcana-engine/effects/effects";

export const kuzcoPanickedLlama: LorcanitoCharacterCard = {
  id: "jd3",
  name: "Kuzco",
  title: "Panicked Llama",
  characteristics: ["storyborn", "king"],
  text: "Evasive\nWE CAN FIGURE THIS OUT At the start of your turn, choose one: \n• Each player draws a card. \n• Each player chooses and discards a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    atTheStartOfYourTurn({
      name: "WE CAN FIGURE THIS OUT",
      text: "At the start of your turn, choose one: \n• Each player draws a card. \n• Each player chooses and discards a card.",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Each player draws a card.",
              effects: [drawXCards(1, self), drawXCards(1, opponent)],
            },
            {
              id: "2",
              text: "Each player chooses and discards a card.",
              effects: [
                {
                  type: "create-layer-for-player",
                  target: opponent,
                  layer: {
                    type: "resolution",
                    responder: "opponent",
                    name: "WE CAN FIGURE THIS OUT",
                    text: "Each player chooses and discards a card.",
                    effects: [discardACard],
                  },
                },
                {
                  type: "create-layer-for-player",
                  target: self,
                  layer: {
                    type: "resolution",
                    name: "WE CAN FIGURE THIS OUT",
                    text: "Each player chooses and discards a card.",
                    effects: [discardACard],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "emerald"],
  cost: 4,
  strength: 2,
  willpower: 2,
  illustrator: "Florencia Vazquez",
  number: 71,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
