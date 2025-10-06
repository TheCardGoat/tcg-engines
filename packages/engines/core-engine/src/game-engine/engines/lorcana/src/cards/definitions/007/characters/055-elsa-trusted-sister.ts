import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaTrustedSister: LorcanaCharacterCardDefinition = {
  id: "tg7",
  name: "Elsa",
  title: "Trusted Sister",
  characteristics: ["storyborn", "hero", "queen", "sorcerer"],
  text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "WHAT DO WE DO NOW?",
      text: "Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 1,
          },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Anna" },
            },
          ],
        },
      ],
      effects: [
        {
          type: "lore",
          modifier: "add",
          amount: 1,
          target: self,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 3,
  illustrator: "Amber Koomanvonpa",
  number: 55,
  set: "007",
  rarity: "common",
  lore: 1,
};
