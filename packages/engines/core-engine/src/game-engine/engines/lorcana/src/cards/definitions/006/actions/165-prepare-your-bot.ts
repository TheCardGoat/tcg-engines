import {
  modalEffect,
  readyAndRestrictQuestEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const prepareYourBot: LorcanaActionCardDefinition = {
  id: "ht1",
  missingTestCase: true,
  name: "Prepare Your Bot",
  characteristics: ["action"],
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
      effects: [
        modalEffect([
          {
            text: "Ready chosen item.",
            effects: [{ type: "ready", targets: [chosenItemTarget] }],
          },
          {
            text: "Ready chosen Robot character. They can't quest for the rest of this turn.",
            effects: readyAndRestrictQuestEffect({
              targets: {
                type: "card",
                cardType: "character",
                withClassification: "robot",
                count: 1,
              },
            }),
          },
        ]),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Ian MacDonald",
  number: 165,
  set: "006",
  rarity: "uncommon",
};
