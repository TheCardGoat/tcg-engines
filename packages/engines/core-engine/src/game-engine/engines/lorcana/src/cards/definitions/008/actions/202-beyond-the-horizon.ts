import {
  discardCardEffect,
  drawCardEffect,
  modalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import {
  eachOpponentTarget,
  eachPlayerTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beyondTheHorizon: LorcanaActionCardDefinition = {
  id: "yv0",
  name: "Beyond The Horizon",
  characteristics: ["action", "song"],
  text: "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
  type: "action",
  abilities: [
    singerTogetherAbility(7),
    {
      type: "static",
      text: "Choose any number of players. They discard their hands and draw 3 cards each.",
      effects: [
        modalEffect([
          {
            text: "Both Players Discard their Hands and Draw 3 Cards",
            effects: [
              discardCardEffect({ targets: [eachPlayerTarget], value: 60 }),
              drawCardEffect({ targets: [eachPlayerTarget], value: 3 }),
            ],
          },
          {
            text: "You discard your hand and draw 3 cards",
            effects: [
              discardCardEffect({ targets: [selfPlayerTarget], value: 60 }),
              drawCardEffect({ targets: [selfPlayerTarget], value: 3 }),
            ],
          },
          {
            text: "Your opponent discards their hand and draws 3 cards",
            effects: [
              discardCardEffect({ targets: [eachOpponentTarget], value: 60 }),
              drawCardEffect({ targets: [eachOpponentTarget], value: 3 }),
            ],
          },
        ]),
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 7,
  illustrator: "Taranah",
  number: 202,
  set: "008",
  rarity: "uncommon",
};
