import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineSteadyStrategist: LorcanaCharacterCardDefinition = {
  id: "om6",
  name: "Jasmine",
  title: "Steady Strategist",
  characteristics: ["floodborn", "hero", "princess"],
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)\nALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    shiftAbility(2, "Jasmine"),
    wheneverThisCharacterQuests({
      name: "ALWAYS PLANNING",
      text: "Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      optional: true,
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 3,
            top: 0,
            inkwell: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            {
              filter: "characteristics",
              value: ["ally"],
            },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire", "steel"],
  cost: 4,
  strength: 2,
  willpower: 5,
  illustrator: "Hedvig H.S",
  number: 171,
  set: "008",
  rarity: "super_rare",
  lore: 1,
};
