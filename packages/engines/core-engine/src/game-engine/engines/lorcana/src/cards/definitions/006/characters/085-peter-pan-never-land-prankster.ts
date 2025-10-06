// TODO: Once the set is released, we organize the cards by set and type

import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { PlayerRestrictionStaticAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { opponent } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const ability: PlayerRestrictionStaticAbility = {
  type: "static",
  ability: "player-restriction",
  effect: {
    type: "player-restriction",
    restriction: "gain-lore",
    target: opponent,
  },
};

export const peterPanNeverLandPrankster: LorcanaCharacterCardDefinition = {
  id: "cvd",
  name: "Peter Pan",
  title: "Never Land Prankster",
  characteristics: ["storyborn", "hero"],
  text: "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
  type: "character",
  abilities: [
    entersPlayExerted({
      name: "Look Innocent",
    }),
    whileConditionThisCharacterGains({
      name: "Can't Take A Joke?",
      text: "While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
      ability: ability,
      conditions: [
        { type: "exerted" },
        {
          type: "this-turn",
          value: "has-challenged",
          target: "opponent",
          negate: true,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 1,
  illustrator: "Ellie Horie",
  number: 85,
  set: "006",
  rarity: "super_rare",
};
