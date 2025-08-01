import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  allYourCharacteristicCharacters,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { PlayEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

const ability: StaticAbilityWithEffect = {
  type: "static",
  ability: "effects",
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      modifier: "add",
      amount: 1,
      duration: "turn",
      target: thisCharacter,
    },
  ],
};

const helpingHand: PlayEffect = {
  type: "play",
  forFree: true,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
      { filter: "type", value: "character" },
      { filter: "characteristics", value: ["ally"] },
      {
        filter: "attribute",
        value: "cost",
        comparison: { operator: "lte", value: 3 },
      },
    ],
  },
};

export const aladdinResearchAssistant: LorcanitoCharacterCard = {
  id: "vw0",
  name: "Aladdin",
  title: "Research Assistant",
  characteristics: ["storyborn", "hero"],
  text: "HELPING HAND Whenever this character quests, you can play an Ally character with cost 3 or less for free.\nPUT IN THE EFFORT While this character exerted, your Ally characters gain +1 {S}.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "HELPING HAND",
      text: "Whenever this character quests, you can play an Ally character with cost 3 or less for free.",
      optional: true,
      effects: [helpingHand],
    }),
    whileConditionOnThisCharacterTargetsGain({
      name: "PUT IN THE EFFORT",
      text: "While this character exerted, your Ally characters gain +1 {S}.",
      conditions: [{ type: "exerted" }],
      target: allYourCharacteristicCharacters(["ally"], true),
      ability: ability,
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Milica Celtelovic",
  number: 197,
  set: "007",
  rarity: "rare",
  lore: 2,
};
