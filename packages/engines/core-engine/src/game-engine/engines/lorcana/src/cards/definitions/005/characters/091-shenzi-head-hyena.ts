import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { StaticAbilityWithEffect } from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const stickAroundForDinner: StaticAbilityWithEffect = {
  type: "static",
  ability: "effects",
  name: "Stick Around For Dinner",
  text: "This character gets +1 {S} for each other Hyena character you have in play.",
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: {
        dynamic: true,
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["hyena"] },
        ],
      },
      modifier: "add",
      target: thisCharacter,
    },
  ],
};

export const shenziHeadHyena: LorcanaCharacterCardDefinition = {
  id: "m32",
  name: "Shenzi",
  title: "Head Hyena",
  characteristics: ["storyborn", "ally", "hyena"],
  text: "**STICK AROUND FOR DINNER** This character gets +1 {S} for each other Hyena character you have in play. **WHAT HAVE WE GOT HERE?** Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
  type: "character",
  abilities: [
    stickAroundForDinner,
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "WHAT HAVE WE GOT HERE",
      text: "Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      effects: [youGainLore(2)],
      defenderFilter: [
        {
          filter: "status",
          value: "damage",
          comparison: { operator: "gt", value: 0 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Otto Paredes",
  number: 91,
  set: "SSK",
  rarity: "rare",
};
