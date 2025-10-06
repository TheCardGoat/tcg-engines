import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodSharpshooter: LorcanaCharacterCardDefinition = {
  id: "zti",
  name: "Robin Hood",
  title: "Sharpshooter",
  characteristics: ["hero", "storyborn"],
  text: "**MY GREATEST PERFORMANCE** Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "My Greatest Performance",
      text: "Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
      effects: [
        {
          type: "scry",
          mode: "discard",
          shouldRevealTutored: true,
          amount: 4,
          target: self,
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "characteristics", value: ["action"] },
            {
              filter: "attribute",
              value: "cost",
              comparison: { operator: "lte", value: 6 },
            },
          ],
          playFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "characteristics", value: ["action"] },
            {
              filter: "attribute",
              value: "cost",
              comparison: { operator: "lte", value: 6 },
            },
          ],
          limits: {
            play: 1,
            bottom: 0,
            top: 0,
            hand: 0,
            inkwell: 0,
            discard: 4,
          },
        },
      ],
    }),
  ],
  colors: ["ruby"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Federico Maria Cugliari",
  number: 118,
  set: "SSK",
  rarity: "legendary",
};
