import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chichaDedicatedMother: LorcanitoCharacterCardDefinition = {
  id: "lux",
  name: "Chicha",
  title: "Dedicated Mother",
  characteristics: ["storyborn", "ally"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)_ **ONE ON THE WAY** During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "static-triggered",
      name: "On the way",
      text: "During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
      trigger: {
        on: "inkwell",
        target: {
          type: "card",
          value: "all",
          filters: [
            { filter: "owner", value: "self" },
            {
              filter: "turn",
              value: "inkwell",
              targetFilter: [{ filter: "owner", value: "self" }],
              comparison: { operator: "eq", value: 2 },
            },
          ],
        },
      },
      layer: {
        type: "resolution",
        name: "On the way",
        text: "During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
        optional: true,
        effects: [drawACard],
      },
    },
  ],
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Grace Tran",
  number: 146,
  set: "SSK",
  rarity: "rare",
};
