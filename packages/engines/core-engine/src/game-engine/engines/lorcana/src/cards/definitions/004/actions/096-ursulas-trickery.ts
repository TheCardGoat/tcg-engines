import {
  discardCardEffect,
  drawCardEffect,
  optionalChoiceEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulasTrickery: LorcanaActionCardDefinition = {
  id: "fr4",
  missingTestCase: true,
  name: "Ursula's Trickery",
  characteristics: ["action"],
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
      responder: "opponent",
      effects: [
        optionalChoiceEffect({
          choice: discardCardEffect({ value: 1 }),
          onDecline: drawCardEffect({
            targets: [selfPlayerTarget],
            value: 1,
          }),
          responder: "opponent",
          targets: [eachOpponentTarget],
        }),
      ],
    },
  ],
  flavour:
    "How dare you double-cross me! Ursula shouted, lunging at the other glimmer.",
  colors: ["emerald"],
  cost: 1,
  illustrator: "Matthew Robert Davies",
  number: 96,
  set: "URR",
  rarity: "uncommon",
};
