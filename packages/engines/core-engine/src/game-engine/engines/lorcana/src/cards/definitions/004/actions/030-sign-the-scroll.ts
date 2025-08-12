import {
  discardCardEffect,
  gainLoreEffect,
  optionalChoiceEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const signTheScroll: LorcanaActionCardDefinition = {
  id: "x7p",
  missingTestCase: true,
  name: "Sign The Scroll",
  characteristics: ["action"],
  text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
      responder: "opponent",
      effects: [
        optionalChoiceEffect({
          choice: discardCardEffect({ value: 1 }),
          onDecline: gainLoreEffect({
            targets: [selfPlayerTarget],
            value: 2,
          }),
          responder: "opponent",
          targets: [eachOpponentTarget],
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 3,
  illustrator: "Mariana Moreno Ayala",
  number: 30,
  set: "URR",
  rarity: "uncommon",
};
