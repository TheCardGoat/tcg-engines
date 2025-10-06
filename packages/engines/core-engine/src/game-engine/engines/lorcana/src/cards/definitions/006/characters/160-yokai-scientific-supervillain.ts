// TODO: Once the set is released, we organize the cards by set and type

import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yokaiScientificSupervillain: LorcanaCharacterCardDefinition = {
  id: "lrm",
  missingTestCase: true,
  name: "Yokai",
  title: "Scientific Supervillain",
  characteristics: ["floodborn", "villain", "inventor"],
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
  type: "character",
  abilities: [
    shiftAbility(6, "Yokai"),
    {
      type: "static",
      ability: "effects",
      name: "Neurotransmitter",
      text: "You may play items named Microbots for free.",
      effects: [
        {
          type: "attribute",
          attribute: "cost",
          amount: 99,
          modifier: "subtract",
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "item" },
              { filter: "zone", value: "hand" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "Microbots" },
              },
            ],
          },
        },
      ],
    },
    wheneverQuests({
      name: "Technical Gain",
      text: "Whenever this character quests, draw a card for each opposing character with 0 {S}.",
      effects: [
        drawXCards({
          dynamic: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "opponent" },
            {
              filter: "attribute",
              value: "strength",
              comparison: { operator: "eq", value: 0 },
            },
          ],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 9,
  strength: 6,
  willpower: 10,
  lore: 2,
  illustrator: "Nicola Saviori",
  number: 160,
  set: "006",
  rarity: "rare",
};
